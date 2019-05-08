const env = process.env.NODE_ENV; // 'dev' or 'test'
require('dotenv').config();

const dev = {
  db: process.env.DATABASE_URL,
};

const test = {
  db: process.env.DATABASE_TEST_URL,
};

const config = {
  dev,
  test,
};

module.exports = config[env];
