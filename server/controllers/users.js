import {
  pool
} from '../db/db';
import Token from '../helpers/jwt';
import jwt from 'jsonwebtoken';

const uniqueId = () => {
  var user_id = 'id-' + Math.random().toString(36).substr(2, 16);
  return user_id
};

var m = new Date();
var dateString =
  m.getFullYear() + "/" +
  ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
  ("0" + m.getDate()).slice(-2) + " " +
  ("0" + m.getHours()).slice(-2) + ":" +
  ("0" + m.getMinutes()).slice(-2) + ":" +
  ("0" + m.getSeconds()).slice(-2);

var status = "unverified";
var isAdmin = false;
var userid = uniqueId();
var signedup_date = dateString;

class Authentication {

  static welcome(req, res) {
    return res.status(200).json({
      success: true,
      message: "welcome to the api",
    });
  }

  static signup(req, res) {
    try {
      const {
        firstname,
        lastname,
        address,
        email,
        password
      } = req.body;

      pool.query('SELECT email FROM users WHERE email = ($1)', [email], (error, dbRes) => {
        if (error) {
          return res.status(500).json({
            "message": "Internal server error"
          });
        } else {
          if (dbRes.rows[0] == undefined) {
            pool.query('INSERT INTO users (email, firstname, lastname, password, address, status, isAdmin, userid, signedup_date) values($1, $2, $3, $4, $5, $6 , $7 ,$8 , $9)',
              [email, firstname, lastname, password, address, status, isAdmin, userid, signedup_date], (errorRes) => {

                if (errorRes) {
                  console.log(errorRes);
                  return res.status(500).json({
                    status: 500,
                    data: {
                      message: 'Sign Up failed. Try again',
                      description: 'Could not create user'
                    }
                  });

                } else {
                  var token = Token.generateToken({
                    email: email,
                    userid: userid
                  });
                  return res.status(201).json({
                    status: '201',
                    success: true,
                    data: {
                      message: 'User created',
                      signedup_on: signedup_date,
                      token: token,
                      id: userid,
                      firstname: firstname,
                      lastname: lastname,
                      email: email
                    }
                  });
                }
              });
          } else {
            return res.status(409).json({
              status: 409,
              message: `this email :${email} already exist`
            });
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        "message": "server error"
      });
    }
  }

  static login(req, res) {
    const {
      email,
      password
    } = req.body;

    pool.query('SELECT * FROM users WHERE email = ($1)', [email], (error, dbRes) => {
      if (error) {
        return res.status(500).json({
          "message": "Internal server error"
        });
      } else {
        if (dbRes.rows[0] == undefined || dbRes.rows[0] == null) {
          return res.status(401).json({
            "message": "Invalid email or password"
          });
        } else {
          // user password to use in comparison
          var userDatabasepassword = dbRes.rows[0].password;
          var usercurrentpassword = password;
          // generate token
          var token = Token.generateToken({
            email: dbRes.rows[0].email,
            id: dbRes.rows[0].id,
            userid: dbRes.rows[0].userid
          });
          return res.status(200).json({
            status: 200,
            message: "successful log in",
            data: {
              token: token,
              id: dbRes.rows[0].userid,
              firstname: dbRes.rows[0].firstname,
              lastname: dbRes.rows[0].lastname,
              email: dbRes.rows[0].email,
              loggedin_at: dbRes.rows[0].signedup_date
            }
          });
        }
      }
    });
  }

  static async allUsers(req, res) {
    try {
      await pool.query('SELECT * FROM users', (errorRes, dbRes) => {
        if (errorRes) {
          const replyServer = {
            status: '500',
            message: 'Internal Server Error',
          };
          return res.status(500).json(replyServer);
        } else {
          if (dbRes.rows[0] == undefined) {
            return res.status(404).json({
              "message": "no users found"
            });
          } else {
            return res.status(200).json({
              message: "all users",
              success: true,
              users: dbRes.rows
            });
          }
        }
      });
    } catch (error) {
      return res.status(500).json({
        "message": "server error"
      });
    }
  }

  static async userProfile(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);

      req.userData = decoded;
      var userRequestLoanid = req.userData.userid;

      await pool.query('SELECT * FROM users WHERE userid = ($1)', [userRequestLoanid], (error, dbRes) => {
        if (error) {
          return res.status(500).json({
            "message": "Internal server error"
          });
        } else {
          if (dbRes.rows[0] == undefined || dbRes.rows[0] == null) {
            return res.status(404).json({
              "message": "User-ID not available"
            });
          } else {
            return res.status(200).json({
              status: 200,
              message: `welcome back ${dbRes.rows[0].firstname}`,
              data: {
                email: dbRes.rows[0].email,
                firstname: dbRes.rows[0].firstname,
                lastname: dbRes.rows[0].lastname,
                address: dbRes.rows[0].address,
                status: dbRes.rows[0].status,
                userid: dbRes.rows[0].userid,
                signedup_on: dbRes.rows[0].signedup_date
              }
            });
          }

        }
      });
    } catch (error) {
      return res.status(404).json({
        "message": "Internal server error"
      });
    }
  }

  static async verifyuser(req, res) {
    try {
      const {
        status
      } = req.body;

      await pool.query('UPDATE users SET status = ($1) WHERE email = $2 returning *;', [status, req.params.email], (error, dbRes) => {
        if (error) {
          return res.status(500).json({
            "message": "Internal server error"
          });
        } else {
          if (dbRes.rows[0] == undefined || dbRes.rows[0] == null) {
            return res.status(404).json({
              status: 404,
              message: "user email not available"
            });
          } else {
            return res.status(200).json({
              status: 202,
              data: {
                id: dbRes.rows[0].userid,
                email: dbRes.rows[0].email,
                firstname: dbRes.rows[0].firstname,
                lastname: dbRes.rows[0].lastname,
                address: dbRes.rows[0].address,
                status: dbRes.rows[0].status
              }
            });
          }
        }
      });

    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "internal server error"
      });
    }
  }
}

export default Authentication;