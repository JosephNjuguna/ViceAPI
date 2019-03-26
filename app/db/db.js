const {
  Pool
} = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const dbConfig = {
  connectionString: process.env.DATABASE_URL
};

const env_setup = (env) => {
  if (env == "development") {
    dbConfig['connectionString'] = process.env.DATABASE_URL;
  } else if (env == "test") {
    dbConfig['connectionString'] = process.env.DATABASE_TEST_URL;
  }
};

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  // console.log(`connected to the database ${dbConfig.connectionString}`);
});

const addTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id serial PRIMARY KEY,
        userid VARCHAR(100) NOT NULL,
        username VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(100)  NOT NULL,
        created_date VARCHAR(100)  NOT NULL
      )`;
  pool.query(queryText)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err;
    });
};

const truncateTables = () =>{
  pool.query('TRUNCATE TABLE users CASCADE',
  (err) => {
    if (err) {
      //  console.log(err);
       pool.end();
    }
  });
};

const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      return res
    })
    .catch((err) => {
      pool.end();
      return err;
    });
};

module.exports = {
  addTables,
  dropTables,
  truncateTables,
  pool,
  env_setup
};