import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthValidator {
  // check user is authorized
  static async checkUser(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
      req.userData = decoded;
      next();
    } catch (e) {
      res.status(401).json({
        status: '401',
        message: 'Auth failed',
        error: e,
      });
    }
  }
  //  check if user is admin
  static async checkAdmin(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
      req.userData = decoded;
      if (req.userData.email == "admin123@mail.com") {
        next();
      } else {
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
}

export default AuthValidator;