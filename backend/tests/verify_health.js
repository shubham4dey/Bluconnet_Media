const http = require('http');
const cp = require('child_process');

function startServer(port, envExtra) {
  const server = cp.spawn('node', ['server.js'], {
    cwd: 'backend',
    env: { ...process.env, PORT: String(port), ...envExtra },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverOutput = '';
  server.stdout.on('data', d => (serverOutput += d.toString()));
  server.stderr.on('data', d => (serverOutput += d.toString()));
  return { server, serverOutput };
}

function makeRequest(port, path, headers) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port,
      path,
      method: 'GET',
      headers: headers || {},
    };
    const req = http.request(opts, res => {
      let body = '';
      res.on('data', c => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

let allPass = true;

setTimeout(async () => {
  try {
    // Test 1: No HEALTH_TOKEN, anonymous
    const s1 = startServer(5998);
    await new Promise(r => setTimeout(r, 2500));
    const r1 = await makeRequest(5998, '/api/health');
    const j1 = JSON.parse(r1.body);
    console.log('TEST 1: No HEALTH_TOKEN, anonymous request');
    console.log('  target exposed:', j1.news.store.target !== undefined);
    console.log('  connect exposed:', j1.news.store.connect !== undefined);
    console.log('  table exposed:', j1.news.store.table !== undefined);
    console.log('  images.cloud exposed:', j1.news.images.cloud !== undefined);
    console.log('  images.folder exposed:', j1.news.images.folder !== undefined);
    const p1 =
      !j1.news.store.target &&
      !j1.news.store.connect &&
      !j1.news.store.table &&
      !j1.news.images.cloud &&
      !j1.news.images.folder;
    console.log('  PASS:', p1);
    allPass = allPass && p1;
    s1.server.kill();

    // Test 2: HEALTH_TOKEN set, wrong token
    const s2 = startServer(5999, { HEALTH_TOKEN: 'test-token-123' });
    await new Promise(r => setTimeout(r, 2500));
    const r2 = await makeRequest(5999, '/api/health', {
      'x-health-token': 'wrong-token',
    });
    const j2 = JSON.parse(r2.body);
    console.log('TEST 2: HEALTH_TOKEN set, wrong x-health-token');
    console.log('  target exposed:', j2.news.store.target !== undefined);
    console.log('  connect exposed:', j2.news.store.connect !== undefined);
    const p2 = !j2.news.store.target && !j2.news.store.connect;
    console.log('  PASS:', p2);
    allPass = allPass && p2;
    s2.server.kill();

    // Test 3: HEALTH_TOKEN set, correct token
    const s3 = startServer(6000, { HEALTH_TOKEN: 'test-token-123' });
    await new Promise(r => setTimeout(r, 2500));
    const r3 = await makeRequest(6000, '/api/health', {
      'x-health-token': 'test-token-123',
    });
    const j3 = JSON.parse(r3.body);
    console.log('TEST 3: HEALTH_TOKEN set, correct x-health-token');
    console.log('  target exposed:', j3.news.store.target !== undefined);
    console.log('  connect exposed:', j3.news.store.connect !== undefined);
    console.log('  images.cloud exposed:', j3.news.images.cloud !== undefined);
    console.log('  images.folder exposed:', j3.news.images.folder !== undefined);
    const p3 =
      j3.news.store.target &&
      j3.news.store.connect &&
      j3.news.images.cloud &&
      j3.news.images.folder;
    console.log('  PASS:', p3);
    allPass = allPass && p3;
    s3.server.kill();

    // Test 4: /health route (not /api/health) also works, no HEALTH_TOKEN
    const s4 = startServer(6001);
    await new Promise(r => setTimeout(r, 2500));
    const r4 = await makeRequest(6001, '/health');
    const j4 = JSON.parse(r4.body);
    console.log('TEST 4: /health route, no HEALTH_TOKEN');
    console.log('  target exposed:', j4.news.store.target !== undefined);
    const p4 = !j4.news.store.target && !j4.news.store.connect;
    console.log('  PASS:', p4);
    allPass = allPass && p4;
    s4.server.kill();

    console.log('');
    console.log('ALL TESTS PASS:', allPass);
  } catch (e) {
    console.error('ERROR:', e.message);
  }
  process.exit(allPass ? 0 : 1);
}, 1000);

setTimeout(() => {
  console.log('TIMEOUT');
  process.exit(1);
}, 60000);
