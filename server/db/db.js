import { Pool } from 'pg';
import config from '../../config/config';
require('dotenv').config();
const dbConfig = {
    connectionString: config.db
};
export const pool = new Pool(dbConfig);

pool.on('connect', (err) => {
    // console.log(`connected to ${dbConfig.connectionString}`);
});
class databaseInit {

    static async addTables(req, res, next) {
        const usersTable =
            `CREATE TABLE IF NOT EXISTS
            users(
              id serial PRIMARY KEY,
              email VARCHAR(128) NOT NULL,
              firstname VARCHAR(128) NOT NULL,
              lastname VARCHAR(128) NOT NULL,
              password VARCHAR(100)  NOT NULL,
              address VARCHAR(128) NOT NULL,
              status VARCHAR(20) NOT NULL,
              isAdmin VARCHAR(20)NOT NULL,
              userid VARCHAR(100) NOT NULL,
              signedup_date VARCHAR(100)  NOT NULL
            )`;
        pool.query(usersTable).then((res) => { return res }).catch((err) => {return err; });
        const loansTable =
            `CREATE TABLE IF NOT EXISTS
            loans(
              id serial PRIMARY KEY,
              loanid VARCHAR(30) NOT NULL,
              firstname VARCHAR(30) NOT NULL,
              lastname VARCHAR(30) NOT NULL,
              email VARCHAR(30) NOT NULL,
              tenor VARCHAR(50) NOT NULL,
              loan_amount VARCHAR(20) NOT NULL,
              paymentInstallment VARCHAR(20) NOT NULL,
              userid VARCHAR(20)NOT NULL,
              status VARCHAR(20) NOT NULL,
              intrest VARCHAR(20) NOT NULL,
              request_date VARCHAR(100)  NOT NULL,
              repaid VARCHAR(10)  NOT NULL
            )`;
        pool.query(loansTable).then((res) => { return res }).catch((err) => {return err; });
    }

    static async truncateTables() {
        pool.query('TRUNCATE TABLE users CASCADE',
            (err) => {
                if (err) {}
            });
    }

    static async dropTables() {
        const queryText = 'DROP TABLE IF EXISTS users';
        pool.query(queryText)
            .then((res) => {
                console.log("table dropped");
                return res
            })
            .catch((err) => {
                return err;
            });
    }

    static async createAdmin() {
        const email = "admin123@mail.com";
        pool.query('SELECT *  from users WHERE email = ($1)',[email],(error, dbRes) =>{
            if(error){
                console.log(error);
            }else{
                if (dbRes.rows[0] == undefined) {
                    var m = new Date();
                    var datestring = m.getFullYear() + "/" +
                        ("0" + (m.getMonth() + 1)).slice(-2) + "/" +
                        ("0" + m.getDate()).slice(-2) + " " +
                        ("0" + m.getHours()).slice(-2) + ":" +
                        ("0" + m.getMinutes()).slice(-2) + ":" +
                        ("0" + m.getSeconds()).slice(-2);

                    const adminUser = {
                        email: "admin123@mail.com",
                        firstname: "admin",
                        lastname: "admin",
                        password: 'qwerQ@qwerre123',
                        address: "database",
                        status: "admin",
                        isAdmin:true,
                        userid: '123admin',
                        signedup_date: datestring
                    };
                    pool.query('INSERT INTO users (email, firstname, lastname, password, address, status, isAdmin, userid, signedup_date) values($1, $2, $3, $4, $5, $6 , $7 ,$8 , $9)',
                    [adminUser.email, adminUser.firstname, adminUser.lastname,adminUser.password, adminUser.address, adminUser.status, adminUser.isAdmin, adminUser.userid, adminUser.signedup_date], (errorRes) => {
                        if(errorRes){
                            console.log(errorRes);
                            
                            console.log("Admin not created");
                        }
                        console.log("admin created");
                    });
                }else{
                    // console.log("admin user exist");
                }
            }
        });
    }
}
export default databaseInit;
