// controllers
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
    users.push(user);
    return res.json({"welcome": user});
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