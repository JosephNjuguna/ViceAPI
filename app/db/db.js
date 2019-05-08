import { Pool } from 'pg';
import config from '../../config/config';
import userDate from '../helpers/Date';
require('dotenv').config();
const dbConfig = {
  connectionString: config.db,
};

class DatabaseInit{

  constructor() {
    this.pool = new Pool(dbConfig);
    this.connect = async () => this.pool.on('connect', (err) => {
      // console.log(`connected to ${dbConfig.connectionString}`);
    });
    
    this.queryText = `CREATE TABLE IF NOT EXISTS users(
          id serial PRIMARY KEY,
          userid VARCHAR(100) NOT NULL,
          email VARCHAR(128) NOT NULL,
          firstname VARCHAR(128) NOT NULL,
          lastname VARCHAR(128) NOT NULL,
          userpassword VARCHAR(128) NOT NULL,
          address VARCHAR(128) NOT NULL,
          status VARCHAR(128) NOT NULL,
          isAdmin VARCHAR(100)  NOT NULL,
          signedupDate VARCHAR(100)  NOT NULL
        )`;
    this.truncate =`TRUNCATE TABLE users CASCADE`;
    this.dropTables = 'DROP TABLE IF EXISTS users';
    this.deleteData = 'DELETE FROM users';
    this.initDb();
    this.createAdmin();
  };

  async query(sql, data = []) {
    const conn = await this.connect();
    try {
      if (data.length) {
          return await conn.query(sql, data);
      }
      return await conn.query(sql);
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async createAdmin () {
    const adminUser = {
      userid: '123admin',
      email: process.env.email,
      firstname: 'admin',
      lastname: 'admin',
      password: process.env.password,
      address: "kenya",
      status: "verified",
      isAdmin: true,
      signedupDate: userDate.date(),
    };
    const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)  returning *';
    const values =  [adminUser.userid, adminUser.email, adminUser.firstname, adminUser.lastname, adminUser.password, adminUser.address, adminUser.status, adminUser.isAdmin, adminUser.signedupDate];
    const { rows } = await this.query(sql, values);
  };

  async initDb() {
    await this.query(this.queryText);
    console.log("Tables are created");
  }

  async deleteData() {
    await this.query(this.deleteData);
    console.log("Data deleted");
  }

  async dropTables(){
    await this.query(this.dropTables);
    console.log("Tables deleted");
  }

}
export default new DatabaseInit();