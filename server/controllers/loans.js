import { pool } from '../db/db';
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

class Loans {

  static async requestLoan(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    req.userData = decoded;
    const {
      loan
    } = req.body;
    var userRequestLoanid = req.userData.userid;

    pool.query('SELECT * FROM users WHERE  userid = ($1)', [userRequestLoanid], (error, dbRes) => {
      if (error) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error First"
        });
      } else {
        var loanId = uniqueId(),
          firstname = dbRes.rows[0].firstname,
          lastname = dbRes.rows[0].lastname,
          email = dbRes.rows[0].email,
          tenor = "3months",
          amountRequested = loan,
          paymentInstallment = 5000,
          userid = dbRes.rows[0].userid,
          status = "pending",
          intrest = "5",
          request_date = dateString,
          repaid = "pending";
        pool.query("SELECT * FROM loans WHERE email = ($1)", [email], (error, dbRes) => {
          if (error) {
            return res.status(500).json({
              status: 500,
              message: "Internal server error (E)"
            })
          } else {
            if (dbRes.rows[0] == undefined) {
              pool.query('INSERT INTO loans (loanid, firstname, lastname, email,  tenor, loan_amount, paymentInstallment, userid, status, intrest, request_date, repaid) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
                [loanId, firstname, lastname, email, tenor, amountRequested, paymentInstallment, userid, status, intrest, request_date, repaid], (errorRes, dbRes) => {
                  if (errorRes) {
                    console.log(errorRes);

                    return res.status(500).json({
                      status: 500,
                      message: "There was a problem processing your request"
                    });
                  } else {
                    return res.status(200).json({
                      status: 200,
                      data: {
                        loanId: dbRes.rows[0].id,
                        firstName: dbRes.rows[0].firstname,
                        lastName: dbRes.rows[0].lastname,
                        email: dbRes.rows[0].email,
                        tenor: dbRes.rows[0].tenor,
                        amount: dbRes.rows[0].loan_amount,
                        paymentInstallment: dbRes.rows[0].paymentinstallment,
                        userid: dbRes.rows[0].userid,
                        status: dbRes.rows[0].status,
                        balance: "balance",
                        intrest: dbRes.rows[0].intrest,
                        loan_requestdate: dbRes.rows[0].request_date
                      }
                    });
                  }
                });
            } else {
              return res.status(400).json({
                status: 400,
                message: "You already have a loan request"
              });
            }
          }
        });
      }
    });
  }

  static async getAllloans(req,res){
    await pool.query('SELECT * FROM loans',(error, dbRes) =>{
      if(error){
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      }else{
        if(dbRes.rows[0] == null){
          return res.status(404).json({
            status: 404,
            message: "No records"
          });
        }else{
          var replyMessage= {
            id: dbRes.rows[0].id,
            user:dbRes.rows[0].email,
            createdOn: dbRes.rows[0].request_date,
            status :dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            loadUUID: dbRes.rows[0].loanid,
            tenor: dbRes.rows[0].tenor,
            amount:dbRes.rows[0].loan_amount,
            paymentInstallment : dbRes.rows[0].paymentInstallment, 
            balance : "balance",
            intrest :dbRes.rows[0].intrest,
          }
          return res.status(200).json({
            status:200,
            data : [replyMessage]
          });
        }
      }
    });
  }

  static async getSingleloan(req,res){    
    await pool.query('SELECT * FROM loans WHERE loanid = ($1)', [req.params.loan_id],(error, dbRes) =>{
      if(error){
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      }else{
        if(dbRes.rows[0] == null){
          return res.status(404).json({
            status: 404,
            message: "No records"
          });
        }else{
          var replyMessage= {
            id: dbRes.rows[0].id,
            user:dbRes.rows[0].email,
            createdOn: dbRes.rows[0].request_date,
            status :dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            tenor: dbRes.rows[0].tenor,
            amount:dbRes.rows[0].loan_amount,
            paymentInstallment : dbRes.rows[0].paymentInstallment, 
            balance : "balance",
            intrest :dbRes.rows[0].intrest,
          };
          return res.status(200).json({
            status:200,
            data : [replyMessage]
          });
        }
      }
    });
  }

  static async userviewCurrentloan(req,res){    
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    req.userData = decoded;
    var userRequestLoanid = req.userData.userid;

    await pool.query('SELECT * FROM loans WHERE userid = ($1)', [userRequestLoanid],(error, dbRes) =>{
      if(error){
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      }else{
        if(dbRes.rows[0] == null){
          return res.status(404).json({
            status: 404,
            message: "You dont have a loan request"
          });
        }else{
          var replyMessage= {
            id: dbRes.rows[0].id,
            user:dbRes.rows[0].email,
            createdOn: dbRes.rows[0].request_date,
            status :dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            tenor: dbRes.rows[0].tenor,
            amount:dbRes.rows[0].loan_amount,
            paymentInstallment : dbRes.rows[0].paymentInstallment, 
            balance : "balance",
            intrest :dbRes.rows[0].intrest,
          };
          return res.status(200).json({
            status:200,
            data : [replyMessage]
          });
        }
      }
    });
  }

  static async acceptLoan(req, res) {
    try {
      const { status } = req.body;
      if(status === "rejected"){
        var repaid = "pending";
      }else if( status === "accepted"){
        var repaid = false;
      }
      await pool.query('UPDATE loans SET status = ($1), repaid = ($2) WHERE loanid = $3 returning *;', [status, repaid, req.params.loan_id], (error, dbRes) => {
        if (error) {
          return res.status(500).json({
            "message": "Internal server error"
          });
        } else {
          if (dbRes.rows[0] == undefined || dbRes.rows[0] == null) {
            return res.status(404).json({
              status: 404,
              message: "loan not found"
            });
          } else {
            return res.status(200).json({
              status: 202,
              data: {
                loanId: dbRes.rows[0].loanid,
                loanAmount :  dbRes.rows[0].loan_amount,
                tenor : dbRes.rows[0].tenor,
                status: dbRes.rows[0].status,
                monthlyInstallment: dbRes.rows[0].paymentinstallment,
                interest :  dbRes.rows[0].intrest
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

  static async notfullyRepaid(req,res){    
    await pool.query('SELECT * FROM loans WHERE status=($1) AND repaid=($2)', [req.query.loan_status, req.query.repaid], (error,dbRes) =>{
      if(error){
        console.log(error);
        return res.status(500).json({
          status: 500,
          message : "Internal server error"
        });
      }else{
        if(dbRes.rows[0] == undefined){
          return res.status(404).json({
            status: 404,
            message: "No record found"
          });
        }else{
          const reply ={
            id: dbRes.rows[0].id,
            user: dbRes.rows[0].email,
            requestedOn : dbRes.rows[0].request_date,
            status: dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            tenor: dbRes.rows[0].tenor,
            amount: dbRes.rows[0].loan_amount,
            paymentInstallment : dbRes.rows[0].paymentinstallment,
            balance : "balance",
            interest : dbRes.rows[0].intrest
          };
          return res.status(200).json({
            status: 200,
            data : [reply]
          });
        }
      }
    });
  }
}
export default Loans;