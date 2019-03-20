const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const dbConfig = { connectionString: process.env.DATABASE_URL };
const pool = new Pool(dbConfig);

pool.on('connect', () => {
  console.log('connected to the db');
});

const addTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        username VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(100)  NOT NULL,
        created_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log('connected');
      
      pool.end();
    })
    .catch((err) => {
      console.log('not connected');
      pool.end();
    });
}

module.exports={ addTables, pool }
