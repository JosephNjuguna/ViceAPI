const reqResponses = require('../helpers/responses');
const {
  pool
} = require('../db/db');

const {Token} = require('../helpers/jwt');


var m  = new Date();
var dateString =
m.getFullYear() + "/" +
("0" + (m.getMonth() + 1)).slice(-2) + "/" +
("0" + m.getDate()).slice(-2) + " " +
("0" + m.getHours()).slice(-2) + ":" +
("0" + m.getMinutes()).slice(-2) + ":" +
("0" + m.getSeconds()).slice(-2);


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
    password: req.body.password,
    signedup_on : dateString
};

  pool.query('SELECT email FROM users WHERE email = ($1)', [user.email], (error, dbRes) => {
    if (error) {
      return res.json({
        "message": "Internal server error"
      });
    } else {
      if (dbRes.rows[0] == undefined) {
        pool.query('INSERT INTO users(userid, username, email, password,  created_date) values($1, $2, $3, $4, $5)',
          [user.user_id, user.username, user.email, user.password, user.signedup_on ], (errorRes) => {

            if (errorRes) {
              const replyServer = {
                status: '500',
                success:false,
                message: 'Sign Up failed. Try again',
                description: 'Could not create user'
              };
              return res.status(500).json({
                "message": replyServer
              });
            } else {
              return res.status(201).json({
                status: '201',
                success: true,
                message: 'User created',
                description: 'sign up successful',
                signedup_on: user.signedup_on
              });
            }
          });
      } else {
        return  res.status(409).json({
          "message": `this email :${user.email} already exist`
        });
      }
    }
  });
}

function login(req, res, login) {
  const user = {
    email : req.body.email,
    password: req.body.password
  };
  pool.query('SELECT email FROM users WHERE email = ($1)', [user.email], (error, dbRes) => {
    if (error) {
      return res.json({
        "message": "Internal server error"
      });
    } else {
      if (dbRes.rows[0] == undefined || dbRes.rows[0] == null) {
        return res.status(401).json({
          "message": "Invalid email or password"
        });
      } else {
        if (login) {

          token = Token.generateToken({
            email: user.email,
            password : user.password
          });
          return res.status(200).json({
            loggedin_at : dateString,
            user: user.email,
            token : token,
            message : "successful log in"
          });
        }
      }
    }
  });
}

function allUsers(req, res) {
  pool.query('SELECT * FROM users', (errorRes, dbRes) => {
    if (errorRes) {
      const replyServer = {
        status: '500',
        message: 'Internal Server Error',
      };
      return res.status(500).send(replyServer);
    } else {
      if (dbRes.rows[0] == undefined) {
        return res.json({
          "message": "no users found"
        });
      } else {
        return res.json({
          message : "all users",
          success : true,
          users: dbRes.rows
        });
      }
    }
  });
}

function userProfile(req, res){
  return res.json({message: "user profile"});
}

module.exports = {
  welcome,
  signup,
  login,
  allUsers,
  userProfile
};
