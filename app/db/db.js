const {
  Pool
} = require('pg');
const config = require('../../config/config');
require('dotenv').config();
const dbConfig = {
  connectionString: config.db
};

const pool = new Pool(dbConfig);

pool.on('connect', (err) => {});

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
      return res;
    })
    .catch((err) => {});
};

const truncateTables = () => {
  pool.query('TRUNCATE TABLE users CASCADE',
    (err) => {
      if (err) {}
    });
};

const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      return res
    })
    .catch((err) => {
      return err;
    });
};

const createAdmin = () => {
  var m = new Date();
  var datestring = m.getFullYear() + "/" +
    ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
    ("0" + m.getDate()).slice(-2) + " " +
    ("0" + m.getHours()).slice(-2) + ":" +
    ("0" + m.getMinutes()).slice(-2) + ":" +
    ("0" + m.getSeconds()).slice(-2);
  
  const adminUser = {
    userid: '123admin',
    username: "admin",
    email: "admin123@mail.com",
    password: 'qwerQ@qwerre123',
    signup_on: datestring
  };
  pool.query("INSERT INTO users (userid, username, email, password, created_date) VALUES ($1, $2, $3, $4, $5)", [
    adminUser.userid, adminUser.username, adminUser.email, adminUser.password, adminUser.signup_on
  ]);
};

module.exports = {
  addTables,
  dropTables,
  truncateTables,
  createAdmin,
  pool
};