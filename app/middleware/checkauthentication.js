const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// check user is authorized
function checkUser(req, res, next){
  try {
    // request for token from the header
    const token = req.headers.authorization.split(' ')[1];
    // decode the token  for user data
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    // get user data
    req.userData = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      status: '401',
      message: 'Auth failed',
      error: e,
    });
  }
};
//  check if user is admin
function checkAdmin(req, res, next){
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    req.userData = decoded;
    if(req.userData.email == "admin123@mail.com"){
      next();
    }else{
      return res.status(401).json({
        message: "Access Denied! You are not allowed to access this route",
      });
    }
  } catch (e) {
    res.status(401).json({
      message: 'Auth failed',
      error: e,
    });
    console.log(e);
    
  }
}

module.exports= {checkUser, checkAdmin};