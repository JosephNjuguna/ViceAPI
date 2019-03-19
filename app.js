const express =  require('express');
const bodyParser = require('body-parser');
const port  = process.env.PORT || 5000;
const routes = require('./server/routes/users');

const app = express();

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(port, (err) => {
  if(err){
    console.log(`Server is not listening on port : ${port}`);
  }else{
    console.log(`Server is listening on port : ${port}`);
  };
});

module.exports = app;
