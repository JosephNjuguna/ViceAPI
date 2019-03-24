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

function signup(req, res) {
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

  pool.query('SELECT email FROM users WHERE email = ($1)', [user.email], (error, dbRes) => {
    if (error) {
      return res.json({
        "message": "Internal server error"
      });
    } else {
      if (dbRes.rows[0] == undefined) {
        pool.query('INSERT INTO users(userid, email, password, username) values($1, $2, $3, $4)',
          [user.user_id, user.email, user.password, user.username], (errorRes) => {

            if (errorRes) {
              const replyServer = {
                status: '500',
                message: 'Internal Server Error',
                description: 'Could not create user'
              };
              return res.status(500).send(replyServer);

            } else {
              const replyServer = {
                status: '201',
                message: 'User created',
                description: 'sign up success'
              };
              return res.status(201).json({
                "message": replyServer
              });
            }

          });
      } else {
        return  res.status(409).json({"message": `this email :${user.email} already exist`});
      }
    }
  });
}
function login(req, res, login) {
}
function allUsers(req, res) {
  pool.query('SELECT * FROM users', (errorRes, dbRes) => {
    if (errorRes) {
      const replyServer = {
        status: '500',
        message: 'Internal Server Error',
      };
      res.status(500).send(replyServer);
    } else {
      if (dbRes.rows[0] == undefined) {
        return res.json({
          "message": "no users found"
        });
      } else {
        return res.json({
          "users": dbRes.rows
        });
      }
    }
  });
}

module.exports = {
  welcome,
  signup,
  login,
  allUsers
};