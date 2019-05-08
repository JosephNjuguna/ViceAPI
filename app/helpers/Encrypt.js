import bcrypt from 'bcrypt';

class EncryptData {
  static generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }

  static validPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

export default EncryptData;
