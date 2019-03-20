const validate = require('../middleware/validations');
const users = [];

module.exports = {
  welcome: function welcome(req, res , next){
    return res.json({"message":" welcome"});
  },

  signup: function signup(req,res,next){
    const user  = {
      username : req.body.name,
      email: req.body.email,
      password : req.body.password
    };
    // when input validation is correct.
    if((validate.emailValidate(user.email)) && (validate.passwordValidate(user.password)) && (validate.usernameValidate(user.username))){
      users.push(user);
      return res.json({"welcome": user});
    // when input is wrong in validations.
    }else{
      if(!(validate.usernameValidate(user.username))){
        return res.json({"message":`${user.username} is not a valid username.enter a valid username`});
      };
      if(!(validate.emailValidate(user.email))){
        return res.json({"message":`${user.email} is not a valid email.enter a valid email`});
      };
      if(!(validate.passwordValidate(user.password))){
        return res.json({"message":`${user.password}: not a valid password. enter a valid pasword`});
      };
    }
  },

  login : function login(req,res,next){
    const user = {
      user : req.body.name || req.body.email,
      password : req.body.password
    };
    return res.json({"user login success" : user});
  },

  allUsers : function allUsers(req, res, next){
    return res.json({"users": users});
  }
};