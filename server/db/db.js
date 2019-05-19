import {
  Pool,
} from 'pg';
import config from '../../config/config';
import userDate from '../helpers/Date';
import totalAmountdetail from '../helpers/Totalamount';

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
          status VARCHAR(10) NOT NULL,
          repaid VARCHAR(10) NOT NULL,
          tenor VARCHAR(12) NOT NULL,
          principalAmount VARCHAR(10) NOT NULL,
          paymentInstallment VARCHAR(10)  NOT NULL,
          totalAmounttopay VARCHAR(28) NOT NULL,
          intrestRate VARCHAR(28) NOT NULL
        )`;

      this.queryPayments = `CREATE TABLE IF NOT EXISTS payments(
          id serial PRIMARY KEY,
          loanid VARCHAR(20) NOT NULL,
          userid VARCHAR(100) NOT NULL,
          paidOn VARCHAR(28) NOT NULL,
          status VARCHAR(10)  NOT NULL,
          repaid VARCHAR(10)  NOT NULL,
          principalAmount VARCHAR(10) NOT NULL,
          balance VARCHAR(10) NOT NULL,
          paid VARCHAR(10)  NOT NULL,
          paymentNo VARCHAR(28) NOT NULL
          )`;

      this.truncate = 'TRUNCATE TABLE users CASCADE';
      this.dropTables = 'DROP TABLE IF EXISTS users';
      this.deleteData = 'DELETE FROM users';

      this.initDb();

      this.createAdmin();
      this.requestLoan();

    } catch (error) {
      console.log(error);
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

  async initDb() {
    try {
      await this.query(this.queryUsers);
      await this.query(this.queryLoans);
      await this.query(this.queryPayments);
      console.log("tables created");
    } catch (error) {
      console.log(error);
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

  async createAdmin() {
    try {
      const email = "admin123@mail.com";
      const sql = `SELECT * FROM users WHERE email='${email}'`;
      const {
        rows
      } = await this.query(sql);
      if (rows.length === 0) {
        const adminUser = {
          userid: '123admin',
          email: process.env.email,
          firstname: 'admin',
          lastname: 'admin',
          password: process.env.password,
          address: 'kenya',
          status: 'verifieddsd',
          isAdmin: true,
          signedupDate: userDate.date()
        };
        const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) values($1, $2, $3, $4, $5, $6 , $7 ,$8 , $9) returning *';
        const value = [adminUser.userid, adminUser.email, adminUser.firstname, adminUser.lastname, adminUser.password, adminUser.address, adminUser.status, adminUser.isAdmin, adminUser.signedupDate];
        const {
          row
        } = this.query(sql, value);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async requestLoan() {
    try {
      const userid = "123admin";
      const sql = `SELECT * FROM loans WHERE userid='${userid}'`;
      const { rows } = await this.query(sql);
      if (rows.length === 0) {
        const amount = parseFloat(2000);
        const calculateTotalamount = totalAmountdetail.totalAmountdata(amount);
        const sqlInsert = 'INSERT INTO loans (loanid, userid, requestedOn,status,repaid,tenor,principalAmount,paymentInstallment,totalAmounttopay,intrestRate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10)  returning *';
        const values = ['123loan', '123admin', '1/1/2019', 'pending', false, calculateTotalamount.numberOfInstallments, amount, calculateTotalamount.installmentAmount, calculateTotalamount.totalamounttoPay, calculateTotalamount.interestRate]
        const {
          row
        } = this.query(sqlInsert, values);
      }
    } catch (error) {
      console.log(error);
    }
  }

}

export default new DatabaseInit();