import jwt from 'jsonwebtoken';
import Usermodel from '../models/Users';
import EncryptData from '../helpers/Encrypt';
import userDate from '../helpers/Date';
import Userid from '../helpers/Uid';
import reqResponses from '../helpers/Responses';
import Token from '../helpers/Token';

const userid = Userid.uniqueId();
const signedupDate = userDate.date();

class Users {

  static async signup(req, res) {
    try {
      const {
        firstname,
        lastname,
        address,
        email,
        password
      } = req.body;
      const hashedPassword = EncryptData.generateHash(password);
      const addUser = new Usermodel({
        userid,
        email,
        firstname,
        lastname,
        password: hashedPassword,
        address,
        status: "unverified",
        isAdmin: false,
        signedupDate,
      });
      if (!await addUser.signup()) {
        reqResponses.handleError(409, 'Email already in use', res);
      }
      const token = Token.genToken(email, userid, firstname, lastname, address);
      reqResponses.handleSignupsuccess(201, 'successfully created account', token, addUser.result, res);
    } catch (error) {
      // console.log(error);
    }
  }

  static async login(req, res) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const addUser = new Usermodel({
        email
      });
      if (await addUser.login()) {
        const email = addUser.result.email;
        const userid = addUser.result.userid;
        const firstname = addUser.result.firstname;
        const lastname = addUser.result.lastname;
        const address = addUser.result.address;
        if (EncryptData.validPassword(password, addUser.result.userpassword)) {
          const token = Token.genToken(email, userid, firstname, lastname, address);
          reqResponses.handleSignupsuccess(200, `welcome ${addUser.result.firstname}`, token, addUser.result, res);
        }
        reqResponses.handleError(401, 'Incorrect password', res);
      }
      reqResponses.handleError(404, 'No Users email found', res);
    } catch (error) {
      // reqResponses.handleError(404, 'email not found. Sign up to create account', res);
    }
  }

  static async allUsers(req, res) {
    try {
      const allUserdata = new Usermodel();
      if (!await allUserdata.allUsers()) {
        reqResponses.handleError(404, 'No Users record found', res);
      }
      reqResponses.handleSuccess(200, 'All users record', allUserdata.result, res);
    } catch (error) {
      console.log(error);
      // reqResponses.internalError(res);
    }
  }

  static async userProfile(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userData = decoded;
      const userProfileid = req.userData.userid;
      const userInfo = new Usermodel(userProfileid);
      if (!await userInfo.findOne()) {
        reqResponses.handleError(404, 'User id not found', res);
      }
      reqResponses.handleSuccess(200, `welcome`, userInfo.result, res);
    } catch (error) {
      // console.log(error);
      // reqResponbses.internalError(res);
    }
  }

  static async oneUser(req, res) {
    try {
      const uId = req.params.u_id;
      const singleUser = new Usermodel(uId);
      if (!await singleUser.findOne()) {
        reqResponses.handleError(404, 'user id not found', res);
      }
      reqResponses.handleSuccess(200, `${singleUser.result.firstname} record`, singleUser.result, res);
    } catch (error) {
      // reqResponses.internalError(res);
    }
  }
  static async verifyUser(req, res) {
    try {
      const {
        email,
      } = req.params;
      const {
        status,
      } = req.body;
      const userVerifaction = new Usermodel({
        email,
        status
      });
      if (!await userVerifaction.verifyUser()) {
        reqResponses.handleError(404, 'User email not found', res);
      }
      reqResponses.handleSuccess(200, 'user verified successfully', userVerifaction.result, res);
    } catch (error) {
      // reqResponses.internalError(res);
    }
  }
}

export default Users;
