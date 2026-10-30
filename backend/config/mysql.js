/**
 * ============================================================
 * MySQL connection + optional Namecheap SSH tunnel.
 *
 * Render backend -> SSH tunnel -> Namecheap MySQL
 *
 * Namecheap:
 *   SSH host: 66.29.132.129
 *   SSH port: 21098
 *   Remote MySQL: 127.0.0.1:3306
 *
 * Render/local MySQL client endpoint:
 *   127.0.0.1:5522
 * ============================================================
 */

require("dotenv").config();

const mysql = require("mysql2/promise");
const net = require("net");
const { Client } = require("ssh2");

// ------------------------------------------------------------
// Defaults
// ------------------------------------------------------------

const DEFAULTS = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "",
  database: "bluconnet_media",
};

// ------------------------------------------------------------
// Environment
// ------------------------------------------------------------

/* Every setting is read through this helper: the first NON-EMPTY value wins.
   Both naming conventions are accepted, because the deployed service may
   define the database with either set of names:

     MYSQL_HOST   / DB_HOST
     MYSQL_PORT   / DB_PORT
     MYSQL_USER   / DB_USER
     MYSQL_PASSWORD / DB_PASSWORD
     MYSQL_DATABASE / DB_NAME / DB_DATABASE

   Previously only the MYSQL_* names were read, so a service configured with
   DB_HOST / DB_NAME silently fell back to the development defaults
   (`root@127.0.0.1:3306/bluconnet_media`) — the exact configuration that can
   never work in production (there is no MySQL inside the Render container),
   which is why the news mirror stayed empty while the real rows sat in the
   Namecheap database. */
function envValue(...names) {
  for (const name of names) {
    const raw = process.env[name];
    if (raw !== undefined && String(raw).trim() !== "") {
      return String(raw).trim();
    }
  }
  return "";
}

const CONNECTION_URI = envValue("MYSQL_URL", "DATABASE_URL");

const DATABASE =
  envValue("MYSQL_DATABASE", "DB_NAME", "DB_DATABASE") || DEFAULTS.database;

const DB_HOST = envValue("MYSQL_HOST", "DB_HOST") || DEFAULTS.host;
const DB_PORT = Number(envValue("MYSQL_PORT", "DB_PORT") || DEFAULTS.port) || DEFAULTS.port;
const DB_USER = envValue("MYSQL_USER", "DB_USER") || DEFAULTS.user;
const DB_PASSWORD = envValue("MYSQL_PASSWORD", "DB_PASSWORD") || DEFAULTS.password;

const SSH_VARS = ["NAMECHEAP_SSH_HOST", "NAMECHEAP_SSH_USER", "NAMECHEAP_SSH_KEY_B64"];
const SSH_MISSING = SSH_VARS.filter((name) => !envValue(name));
const SSH_ENABLED = SSH_MISSING.length === 0;

/* 127.0.0.1 is correct ONLY when the backend runs on the same server as MySQL
   (a cPanel Node.js app). On any other host it points at the container itself,
   where no MySQL is listening — the connection is refused, the news schema is
   never initialised and the public API keeps answering from the empty local
   mirror. That combination is named here so it cannot be mistaken for a
   database/content problem. */
const LOOPBACK_HOSTS = ["127.0.0.1", "localhost", "::1", "0.0.0.0"];
if (!SSH_ENABLED && LOOPBACK_HOSTS.includes(DB_HOST.toLowerCase())) {
  console.error(
    `[mysql] UNREACHABLE TARGET: host=${DB_HOST} (loopback) but the Namecheap SSH ` +
      "tunnel is disabled. A backend on another host cannot reach the Namecheap " +
      "database this way. Either set NAMECHEAP_SSH_HOST / NAMECHEAP_SSH_USER / " +
      "NAMECHEAP_SSH_KEY_B64 (recommended), or point MYSQL_HOST / DB_HOST at a " +
      "MySQL server that is actually reachable from this host."
  );
}

const SSH_HOST = envValue("NAMECHEAP_SSH_HOST");
const SSH_PORT = Number(envValue("NAMECHEAP_SSH_PORT") || 21098) || 21098;
const SSH_USER = envValue("NAMECHEAP_SSH_USER");
const SSH_PASSPHRASE = envValue("NAMECHEAP_SSH_PASSPHRASE");

const TUNNEL_LOCAL_HOST = "127.0.0.1";
const TUNNEL_LOCAL_PORT =
  Number(process.env.MYSQL_TUNNEL_LOCAL_PORT || 5522) || 5522;

const TUNNEL_REMOTE_HOST = "127.0.0.1";
const TUNNEL_REMOTE_PORT = 3306;

// ------------------------------------------------------------
// Namecheap SSH tunnel
// ------------------------------------------------------------

const tunnelState = {
  ssh: null,
  ready: false,
  connecting: false,
  server: null,
  reconnectTimer: null,
  queue: [],
};

function getPrivateKey() {
  try {
    return Buffer.from(process.env.NAMECHEAP_SSH_KEY_B64, "base64");
  } catch (err) {
    throw new Error("Invalid NAMECHEAP_SSH_KEY_B64");
  }
}

function flushTunnelQueue() {
  if (!tunnelState.ready) return;

  const queued = tunnelState.queue.splice(0);

  for (const socket of queued) {
    if (!socket.destroyed) {
      openForward(socket);
    }
  }
}

function openForward(socket) {
  if (socket.destroyed) return;

  if (!tunnelState.ready || !tunnelState.ssh) {
    socket.pause();

    tunnelState.queue.push(socket);

    socket.once("close", () => {
      const index = tunnelState.queue.indexOf(socket);

      if (index !== -1) {
        tunnelState.queue.splice(index, 1);
      }
    });

    return;
  }

  const ssh = tunnelState.ssh;

  ssh.forwardOut(
    "127.0.0.1",
    0,
    TUNNEL_REMOTE_HOST,
    TUNNEL_REMOTE_PORT,
    (err, stream) => {
      if (err) {
        console.error("[mysql/ssh] forward error:", err.message);
        socket.destroy();
        return;
      }

      socket.pipe(stream);
      stream.pipe(socket);

      stream.on("error", (streamErr) => {
        console.error(
          "[mysql/ssh] stream error:",
          streamErr.message
        );

        socket.destroy();
      });

      socket.on("error", () => {
        stream.destroy();
      });

      socket.on("close", () => {
        stream.destroy();
      });

      socket.resume();
    }
  );
}

function scheduleSSHReconnect() {
  if (tunnelState.reconnectTimer) return;

  tunnelState.reconnectTimer = setTimeout(() => {
    tunnelState.reconnectTimer = null;
    connectSSH();
  }, 5000);
}

function connectSSH() {
  if (!SSH_ENABLED) return;

  if (tunnelState.connecting || tunnelState.ready) {
    return;
  }

  tunnelState.connecting = true;

  const ssh = new Client();

  tunnelState.ssh = ssh;

  ssh.on("ready", () => {
    tunnelState.connecting = false;
    tunnelState.ready = true;

    console.log(
      `[mysql/ssh] SSH tunnel connected to ${SSH_USER}@${SSH_HOST}:${SSH_PORT}`
    );

    console.log(
      `[mysql/ssh] MySQL forwarding: ${TUNNEL_LOCAL_HOST}:${TUNNEL_LOCAL_PORT} -> ${TUNNEL_REMOTE_HOST}:${TUNNEL_REMOTE_PORT}`
    );

    flushTunnelQueue();
  });

  ssh.on("error", (err) => {
    tunnelState.connecting = false;
    tunnelState.ready = false;

    console.error(
      "[mysql/ssh] SSH error:",
      err.message
    );
  });

  ssh.on("close", () => {
    tunnelState.connecting = false;
    tunnelState.ready = false;

    if (tunnelState.ssh === ssh) {
      tunnelState.ssh = null;
    }

    console.error(
      "[mysql/ssh] SSH connection closed. Reconnecting in 5 seconds..."
    );

    scheduleSSHReconnect();
  });

  try {
    ssh.connect({
      host: SSH_HOST,
      port: SSH_PORT,
      username: SSH_USER,
      privateKey: getPrivateKey(),
      passphrase: SSH_PASSPHRASE || undefined,
      readyTimeout: 20000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 3,
    });
  } catch (err) {
    tunnelState.connecting = false;

    console.error(
      "[mysql/ssh] SSH connect failed:",
      err.message
    );

    scheduleSSHReconnect();
  }
}

function startNamecheapTunnel() {
  if (!SSH_ENABLED) {
    console.log(
      "[mysql/ssh] SSH tunnel disabled. Using direct MySQL connection."
    );

    return;
  }

  tunnelState.server = net.createServer((socket) => {
    openForward(socket);
  });

  tunnelState.server.on("error", (err) => {
    console.error(
      "[mysql/ssh] Local tunnel server error:",
      err.message
    );
  });

  tunnelState.server.listen(
    TUNNEL_LOCAL_PORT,
    TUNNEL_LOCAL_HOST,
    () => {
      console.log(
        `[mysql/ssh] Local tunnel listening on ${TUNNEL_LOCAL_HOST}:${TUNNEL_LOCAL_PORT}`
      );

      connectSSH();
    }
  );
}

if (SSH_ENABLED) {
  startNamecheapTunnel();
} else {
  /* Namecheap MySQL is NOT reachable from the public internet on port 3306
     (only the cPanel SSH port is open) — verified from an outside host. A
     deployed backend that is not allowed to reach it over the internet has to
     go through this tunnel, so the missing variables are logged explicitly
     instead of failing later with an opaque ECONNREFUSED. */
  console.warn(
    `[mysql] Namecheap SSH tunnel DISABLED — missing: ${SSH_MISSING.join(", ")}. ` +
      `Falling back to a direct MySQL connection to ${DB_HOST}:${DB_PORT}. ` +
      "Set the NAMECHEAP_SSH_* variables (host, user, base64 private key) on the " +
      "service to reach the Namecheap database from outside."
  );
}

// ------------------------------------------------------------
// MySQL pool options
// ------------------------------------------------------------

const poolOptions = {
  waitForConnections: true,

  connectionLimit:
    Number(process.env.MYSQL_CONNECTION_LIMIT || 10) || 10,

  queueLimit: 0,

  /* A connection through the Namecheap SSH tunnel is established lazily: the
     very first `getConnection()` at boot waits for the SSH handshake
     (66.29.132.129:21098) to complete and for the socket to be forwarded.
     mysql2's own default is 10s, which a cold start + SSH handshake can easily
     exceed — the connect then fails, the schema is never marked ready and the
     API keeps serving an empty local mirror for the whole lifetime of the
     instance. A longer budget (20s, `MYSQL_CONNECT_TIMEOUT` to override) makes
     the first connect survive that handshake. */
  connectTimeout:
    Number(envValue("MYSQL_CONNECT_TIMEOUT") || 20000) || 20000,

  charset: "utf8mb4_unicode_ci",

  enableKeepAlive: true,

  keepAliveInitialDelay: 10000,

  supportBigNumbers: true,

  bigNumberStrings: false,
};

// ------------------------------------------------------------
// Optional SSL
// ------------------------------------------------------------

if (
  String(process.env.MYSQL_SSL || "").toLowerCase() === "true"
) {
  poolOptions.ssl = {
    rejectUnauthorized:
      String(
        process.env.MYSQL_SSL_REJECT_UNAUTHORIZED || "true"
      ).toLowerCase() !== "false",
  };
}

// ------------------------------------------------------------
// MySQL pool
// ------------------------------------------------------------

const pool = CONNECTION_URI
  ? mysql.createPool({
      uri: CONNECTION_URI,
      ...poolOptions,
    })
  : mysql.createPool({
      host: SSH_ENABLED ? TUNNEL_LOCAL_HOST : DB_HOST,

      port: SSH_ENABLED ? TUNNEL_LOCAL_PORT : DB_PORT,

      user: DB_USER,

      password: DB_PASSWORD,

      database: DATABASE,

      ...poolOptions,
    });

// ------------------------------------------------------------
// Public helpers
// ------------------------------------------------------------

function getPool() {
  return pool;
}

function query(sql, params = []) {
  return track(pool.query(sql, params));
}

function execute(sql, params = []) {
  return track(pool.execute(sql, params));
}

function getConnection() {
  return track(pool.getConnection());
}

async function ping() {
  const conn = await getConnection();

  try {
    await conn.ping();
    return true;
  } finally {
    conn.release();
  }
}

/* ------------------------------------------------------------
   Diagnosis — the resolved target + the last connection error.
   `/api/health` reports these so production can be verified without
   access to the host's logs (the password is never included).
   ------------------------------------------------------------ */

let lastError = "";

/** Remember the most recent connection failure (never throws). */
async function track(promise) {
  try {
    return await promise;
  } catch (err) {
    lastError = safeError(err);
    throw err;
  }
}

function clearError() {
  lastError = "";
}

function status() {
  return {
    target: describeTarget(),
    database: DATABASE,
    tunnel: SSH_ENABLED
      ? `${SSH_USER}@${SSH_HOST}:${SSH_PORT}`
      : "disabled",
    tunnelMissing: SSH_ENABLED ? [] : SSH_MISSING,
    connectTimeout: poolOptions.connectTimeout,
    lastError: lastError || null,
  };
}

/**
 * Database already exists on Namecheap.
 *
 * By default, DO NOT run CREATE DATABASE because the cPanel
 * database user normally does not have CREATE DATABASE privilege.
 *
 * To explicitly allow creation elsewhere:
 * MYSQL_CREATE_DATABASE=true
 */
async function ensureDatabase() {
  const database = CONNECTION_URI
    ? new URL(CONNECTION_URI).pathname.replace(/^\//, "") ||
      DATABASE
    : DATABASE;

  const shouldCreate =
    String(
      process.env.MYSQL_CREATE_DATABASE || "false"
    ).toLowerCase() === "true";

  if (!shouldCreate) {
    return database;
  }

  const connection = await (CONNECTION_URI
    ? mysql.createConnection({
        uri: CONNECTION_URI.replace(
          /\/[^/?]*(\?|$)/,
          "/"
        ),
        ...poolOptions,
      })
    : mysql.createConnection({
        host: SSH_ENABLED ? TUNNEL_LOCAL_HOST : DB_HOST,

        port: SSH_ENABLED ? TUNNEL_LOCAL_PORT : DB_PORT,

        user: DB_USER,

        password: DB_PASSWORD,

        ...poolOptions,
      }));

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database.replace(
        /`/g,
        ""
      )}\`
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci`
    );

    return database;
  } finally {
    await connection.end();
  }
}

function describeTarget() {
  if (CONNECTION_URI) {
    try {
      const u = new URL(CONNECTION_URI);

      return `${
        u.username ? u.username + "@" : ""
      }${u.hostname}:${u.port || 3306}/${u.pathname.replace(
        /^\//,
        ""
      )}`;
    } catch (e) {
      return "MYSQL_URL (unparseable)";
    }
  }

  return `${DB_USER}@${
    SSH_ENABLED ? TUNNEL_LOCAL_HOST : DB_HOST
  }:${SSH_ENABLED ? TUNNEL_LOCAL_PORT : DB_PORT}/${DATABASE}`;
}

function safeError(err) {
  if (!err) return "unknown error";

  const code = err.code || err.sqlState || "";

  const message = String(
    err.message || ""
  ).replace(/password[^,;]*/gi, "password=***");

  return `${code ? code + " " : ""}${message}`.trim();
}

function isConnectionError(err) {
  if (!err || !err.code) {
    return false;
  }

  return [
    "ECONNREFUSED",
    "ENOTFOUND",
    "ETIMEDOUT",
    "EHOSTUNREACH",
    "ER_ACCESS_DENIED_ERROR",
    "ER_BAD_DB_ERROR",
    "PROTOCOL_CONNECTION_LOST",
    "ER_CON_COUNT_ERROR",
    "ER_NOT_SUPPORTED_AUTH_MODE",
  ].includes(err.code);
}

async function close() {
  if (tunnelState.server) {
    await new Promise((resolve) => {
      tunnelState.server.close(() => resolve());
    }).catch(() => {});
  }

  if (tunnelState.reconnectTimer) {
    clearTimeout(tunnelState.reconnectTimer);
    tunnelState.reconnectTimer = null;
  }

  if (tunnelState.ssh) {
    tunnelState.ssh.end();
    tunnelState.ssh = null;
  }

  tunnelState.ready = false;
  tunnelState.connecting = false;

  await pool.end();
}

module.exports = {
  pool,
  getPool,
  query,
  execute,
  getConnection,
  ping,
  ensureDatabase,
  describeTarget,
  status,
  clearError,
  safeError,
  isConnectionError,
  close,
  DATABASE,
  tunnel: () => ({
    enabled: SSH_ENABLED,
    host: SSH_HOST,
    port: SSH_PORT,
    user: SSH_USER,
    missing: SSH_MISSING,
    localPort: TUNNEL_LOCAL_PORT,
  }),
};