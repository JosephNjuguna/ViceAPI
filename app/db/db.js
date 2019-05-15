import {
  Pool,
} from 'pg';
import config from '../../config/config';
import userDate from '../helpers/Date';

require('dotenv').config();

const dbConfig = {
  connectionString: config.db,
};

class DatabaseInit {
  constructor() {
    try {
      this.pool = new Pool(dbConfig);
      this.connect = async () => this.pool.on('connect', (err) => {
        // console.log(`connected to ${dbConfig.connectionString}`);
      });

      this.queryUsers = `CREATE TABLE IF NOT EXISTS users(
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

      this.queryLoans = `CREATE TABLE IF NOT EXISTS loans(
          id serial PRIMARY KEY,
          loanid VARCHAR(20) NOT NULL,
          userid VARCHAR(28) NOT NULL,
          requestedOn VARCHAR(28) NOT NULL,
          status VARCHAR(10)  NOT NULL,
          repaid VARCHAR(10)  NOT NULL,
          tenor VARCHAR(12) NOT NULL,
          principalAmount VARCHAR(10) NOT NULL,
          paymentInstallment VARCHAR(10)  NOT NULL,
          totalAmounttopay VARCHAR(28) NOT NULL,
          intrestRate VARCHAR(28) NOT NULL
        )`;

      this.queryPayments = `CREATE TABLE IF NOT EXISTS payments(
          id serial PRIMARY KEY,
          loanid VARCHAR(20) NOT NULL,
          useremail VARCHAR(100) NOT NULL,
          requestedOn VARCHAR(28) NOT NULL,
          status VARCHAR(10)  NOT NULL,
          repaid VARCHAR(10)  NOT NULL,
          tenor VARCHAR(12) NOT NULL,
          principalAmount VARCHAR(10) NOT NULL,
          paymentInstallment VARCHAR(10)  NOT NULL,
          totalAmounttopay VARCHAR(28) NOT NULL,
          balance VARCHAR(28) NOT NULL,
          intrestRate VARCHAR(28) NOT NULL
        )`;

      this.truncate = 'TRUNCATE TABLE users CASCADE';
      this.dropTables = 'DROP TABLE IF EXISTS users';
      this.deleteData = 'DELETE FROM users';
      this.initDb();
      this.createAdmin();
    } catch (error) {
    }
  }

  async query(sql, data = []) {
    const conn = await this.connect();
    try {
      if (data.length) {
        return await conn.query(sql, data);
      }
      return await conn.query(sql);
    } catch (err) {
      return err;
    }
  }

  async createAdmin() {
    const adminUser = {
      userid: '123admin',
      email: process.env.email,
      firstname: 'admin',
      lastname: 'admin',
      password: process.env.password,
      address: 'kenya',
      status: 'verified',
      isAdmin: true,
      signedupDate: userDate.date(),
    };
    const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9)';
    const values = [adminUser.userid, adminUser.email, adminUser.firstname, adminUser.lastname, adminUser.password, adminUser.address, adminUser.status, adminUser.isAdmin, adminUser.signedupDate];
  }

  async initDb() {
    try {
      await this.query(this.queryUsers);
      await this.query(this.queryLoans);
      await this.query(this.queryPayments);
      console.log("tables created");
      
    } catch (error) {
    }
  }

  async deleteData() {
    await this.query(this.deleteData);
    console.log('Data deleted');
  }

  async dropTables() {
    await this.query(this.dropTables);
    console.log('Tables deleted');
  }
}
export default new DatabaseInit();
