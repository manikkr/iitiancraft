const { Pool } = require('pg');
require('dotenv').config({ path: './config.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool; 