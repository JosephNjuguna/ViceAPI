const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/users');
const {addTables, createAdmin} = require('./app/db/db');

addTables();
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/', routes);
module.exports = app;