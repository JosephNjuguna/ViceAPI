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
        password,
      } = req.body;
      const hashedPassword = EncryptData.generateHash(password);
      const addUser = await new Usermodel({
        userid,
        email,
        firstname,
        lastname,
        password: hashedPassword,
        address,
        status: 'unverified',
        isAdmin: false,
        signedupDate,
      });
      if (!addUser.signup()) {
        reqResponses.handleError(409, 'Email already in use', res);
      }
      const token = Token.genToken(email, userid, firstname, lastname, address);
      return reqResponses.handleSignupsuccess(201, 'successfully created account', token, addUser.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async login(req, res) {
    try {
      const incomingEmail = req.body.email;
      const { password } = req.body;
      const addUser = await Usermodel.login(incomingEmail);
      const {
        email, userid, firstname, lastname, address,
      } = addUser;
      if (EncryptData.validPassword(password, addUser.userpassword)) {
        const token = Token.genToken(email, userid, firstname, lastname, address);
        reqResponses.handleSignupsuccess(200, `welcome ${firstname}`, token, addUser, res);
      } else {
        reqResponses.handleError(401, 'Incorrect password', res);
      }
    } catch (error) {
      console.log(error.toString());
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async allUsers(req, res) {
    try {
      const allUserdata = await new Usermodel();
      if (!allUserdata.allUsers()) {
        reqResponses.handleError(404, 'No Users record found', res);
      }
      reqResponses.handleSuccess(200, 'All users record', allUserdata.result, res);
    } catch (error) {
      console.log(error.toString());
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async userProfile(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      req.userData = decoded;
      const userProfileid = req.userData.userid;
      const userInfo = await Usermodel.findOne(userProfileid);
      if (!userInfo) {
        return reqResponses.handleError(404, 'User id not found', res);
      }
      reqResponses.handleSuccess(200, 'welcome', userInfo.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async oneUser(req, res) {
    try {
      const uId = req.params.u_id;
      const singleUser = await new Usermodel(uId);
      if (!singleUser.findOne()) {
        reqResponses.handleError(404, 'user id not found', res);
      }
      reqResponses.handleSuccess(200, `${singleUser.result.firstname} record`, singleUser.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }

  static async verifyUser(req, res) {
    try {
      const { email } = req.params;
      const { status } = req.body;

      const userVerifaction = await Usermodel.verifyUser(email, status);

      if (!userVerifaction) {
        return reqResponses.handleError(404, 'User email not found', res);
      }
      reqResponses.handleSuccess(200, 'user verified successfully', userVerifaction.result, res);
    } catch (error) {
      reqResponses.handleError(500, error.toString(), res);
    }
  }
}
export default Users;
