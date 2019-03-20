const validate = require('../middleware/validations');
const {
  pool
} = require('../db/db');
const users = [];

module.exports = {
  welcome: function welcome(req, res, next) {
    return res.json({
      "message": " welcome"
    });
  },
  signup: function signup(req, res, next) {
    const uniqueId =() => {
      var user_id = 'id-' + Math.random().toString(36).substr(2, 16);
      return user_id
    };
    
    const user = {
      user_id: uniqueId(), 
      username: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    // when input validation is correct.
    if ((validate.emailValidate(user.email)) && (validate.passwordValidate(user.password)) && (validate.usernameValidate(user.username))) {
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
            res.json({"message":replyServer }),201;          
          }
        });
      // when input is wrong in validations.
    } else {
      if (!(validate.usernameValidate(user.username))) {
        return res.json({
          "message": `${user.username} is not a valid username.enter a valid username`
        });
      };
      if (!(validate.emailValidate(user.email))) {
        return res.json({
          "message": `${user.email} is not a valid email.enter a valid email`
        });
      };
      if (!(validate.passwordValidate(user.password))) {
        return res.json({
          "message": `${user.password}: not a valid password. enter a valid pasword`
        });
      };
    }
  },

  login: function login(req, res, next) {
    const user = {
      user: req.body.name || req.body.email,
      password: req.body.password
    };
    return res.json({
      "user login success": user
    });
  },

  allUsers: function allUsers(req, res, next) {
    return res.json({
      "users": users
    });
  }
};