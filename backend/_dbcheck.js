'use strict';
const { createConnection } = require('./config/mysql');
const c = createConnection();
c.connect(err => {
  if (err) { console.error('DB_ERROR_CODE=' + (err.code || err.message)); c.end(); process.exit(1); }
  console.log('DB_CONNECTED');
  c.query('SELECT DATABASE() AS db').then(r => { console.log('DB_NAME=' + r[0].db); c.end(); }).catch(e => { console.error('DB_QUERY_ERROR=' + e.message); c.end(); });
});

