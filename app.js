const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes/users');
const { addTables, pool }= require('./app/db/db');
const app = express();

const port = process.env.PORT || 3000;
require('dotenv').config();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);
app.listen(port, (err) => {
  if(err){
    console.log(`Server is not listening on port : ${port}`);
    pool.end();
  }else{
    console.log(`Server is listening on port : ${port}`);
  };
});
addTables()

module.exports = app;