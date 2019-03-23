const reqResponses = require('../helpers/responses');
const {
  pool
} = require('../db/db');

function welcome(req, res, next) {
  const message = [200, "welcome to the api", true];
  return res.status(message[0]).json({
    success: message[2],
    message: message[1],
  });
}

function signup(req, res, next) {
  const uniqueId = () => {
    var user_id = 'id-' + Math.random().toString(36).substr(2, 16);
    return user_id
  };

  const user = {
    user_id: uniqueId(),
    username: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  console.log(user);

  // when input validation is correct.
  pool.query('INSERT INTO users(userid, email, password, username) values($1, $2, $3, $4)',
    [user.user_id, user.email, user.password, user.username], (errorRes) => {
      if (errorRes) {
        const replyServer = {
          status: '500',
          message: 'Internal Server Error',
          description: 'Could not create user'
        };
        console.log(errorRes);
        res.status(500).send(replyServer);
      } else {
        const replyServer = {
          status: '201',
          message: 'User created',
          description: 'sign up success'
        };
        res.json({
          "message": replyServer
        });
      }
    });
  // when input is wrong in validations.
}

function login(req, res, login) {
  const user = {
    user: req.body.name,
    password: req.body.password
  };
  pool.query('SELECT username FROM users WHERE username = ($1)', [user.user], (error, dbRes) => {
    if(error){
      return res.json({"message":"Internal server error"});
    }else{
      if( dbRes.rows[0]== undefined || dbRes.rows[0] == null){
        return res.json({"message":"User not found"});
      }else{
        if(login){
          console.log(dbRes);
          return res.json({"user":"successful login"});
        }
      }
    }
  });
}

function allUsers(req, res, next) {
  pool.query('SELECT * FROM users(userid, email, password, username) values($1, $2, $3, $4)',
    [user.user_id, user.email, user.password, user.username], (errorRes) => {
      if (errorRes) {
        const replyServer = {
          status: '500',
          message: 'Internal Server Error',
          description: 'Could not create user'
        };
        console.log(errorRes);
        res.status(500).send(replyServer);
      } else {
        const replyServer = {
          status: '201',
          message: 'User created',
          description: 'sign up success'
        };
        res.json({
          "message": replyServer
        });
      }
    });
}

module.exports = {
  welcome,
  signup,
  login,
  allUsers
};