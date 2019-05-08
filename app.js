import express from 'express';
import bodyParser from 'body-parser';
import routes from './app/routes';

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
routes(app);

module.exports = app;
