import Db from "../db/db";

class UsersModel {

  constructor(payload = null) {
    this.payload = payload;
    this.result = null;
  }

  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email='${email}'`;
    const {
      rows
    } = await Db.query(sql);
    if (rows.length === 0) {
      return false
    }
    return true;
    this.result
  }

  async signup() {
    const user = {
      userid: this.payload.userid,
      email: this.payload.email,
      firstname: this.payload.firstname,
      lastname: this.payload.lastname,
      password: this.payload.password,
      address: this.payload.address,
      status: this.payload.status,
      isAdmin: this.payload.isAdmin,
      signedupDate: this.payload.signedupDate,
    };
    const findUser = await this.findByEmail(user.email);
    if (findUser === false) {
      const values = [user.userid, user.email, user.firstname, user.lastname, user.password, user.address, user.status, user.isAdmin, user.signedupDate];
      const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *';
      const {
        rows
      } = await Db.query(sql, values);
      this.result = rows[0];
      return true;
    }
    return false;
  }

  async login() {
    const email = this.payload.email;
    const sql = `SELECT * FROM users WHERE email='${email}'`;
    const {
      rows
    } = await Db.query(sql);
    if (rows.length === 0) {
      return false
    }
    this.result = rows[0];
    return true;
  }

  async allUsers() {
    const sql = 'SELECT * FROM users';
    const {
      rows
    } = await Db.query(sql);
    if (rows) {
      this.result = rows;
      return true;
    }
    return false
  }

  async findOne() {
    const sql = `SELECT * FROM users WHERE userid='${this.payload}'`;
    const {
      rows
    } = await Db.query(sql);
    if (rows.length === 0) {
      return false
    }
    this.result = rows[0];
    return true;
  }

  async verifyUser() {
    const sql = 'UPDATE users SET status = ($1) WHERE email = $2 returning *;';
    const values = [this.payload.status, this.payload.email];
    const { rows } = await Db.query(sql, values);
    if (rows.length === 0) {
      return false
    }
    this.result = rows[0];
    return true;
  }
}
export default UsersModel;
