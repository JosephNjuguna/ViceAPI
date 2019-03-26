const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/users');

const {
  addTables,
  pool,
  env_setup
} = require('./app/db/db');

require('dotenv').config();
addTables();
env_setup(process.env.environment);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', routes);

module.exports = app;