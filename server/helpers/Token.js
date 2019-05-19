import Token from './Jwt';
import reqResponses from './Responses';

class TokenGen {
  static genToken(email, userid, firstname, lastname, address) {
    const tokenDetail = Token.generateToken({
      email,
      userid,
      firstname,
      lastname,
      address,
    });
    return tokenDetail;
  }

  static checkToken(token, res) {
    if (!token || token === '') {
      return reqResponses.handleError(400, 'Token required', res);
    }
    return true;
  }
}
export default TokenGen;
