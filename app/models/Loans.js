import Db from '../db/db';
import totalAmountdetail from '../helpers/Totalamount';

class LoanModel {
  constructor(payload = null) {
    this.payload = payload;
    this.result = null;
  }
  static async findMail(userid) {
    const sql = `SELECT * FROM loans WHERE userid='${userid}'`;
    const {
      rows
    } = await Db.query(sql);
    if (rows.length === 0) {
      return false;
    }
    const result = rows[0];
    return result;
  }

  static async requestloan({requestedloan, userid, dateRequested,loanrequestedId}) {
    const amount = parseFloat(requestedloan);
    const calculateTotalamount = totalAmountdetail.totalAmountdata(amount);
    const sqlInsert = 'INSERT INTO loans (loanid, userid, requestedOn,status,repaid,tenor,principalAmount,paymentInstallment,totalAmounttopay,intrestRate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10)';
    const values = [loanrequestedId, userid, dateRequested, 'pending', false, calculateTotalamount.numberOfInstallments, amount, calculateTotalamount.installmentAmount, calculateTotalamount.totalamounttoPay, calculateTotalamount.interestRate];
    const {
      loanRequests
    } = await Db.query(sqlInsert, values);
    return true;
  }

  static async getAllloans(req, res) {
    await pool.query('SELECT * FROM loans', (error, dbRes) => {
      if (error) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      } else {
        if (dbRes.rows[0] == null) {
          return res.status(404).json({
            status: 404,
            message: "No records"
          });
        } else {
          var replyMessage = {
            id: dbRes.rows[0].id,
            user: dbRes.rows[0].email,
            createdOn: dbRes.rows[0].request_date,
            status: dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            loadUUID: dbRes.rows[0].loanid,
            tenor: dbRes.rows[0].tenor,
            amount: dbRes.rows[0].loan_amount,
            paymentInstallment: dbRes.rows[0].paymentInstallment,
            balance: "balance",
            intrest: dbRes.rows[0].intrest,
          }
          return res.status(200).json({
            status: 200,
            data: [replyMessage]
          });
        }
      }
    });
  }

  static async getSingleloan(req, res) {
    await pool.query('SELECT * FROM loans WHERE loanid = ($1)', [req.params.loan_id], (error, dbRes) => {
      if (error) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      } else {
        if (dbRes.rows[0] == null) {
          return res.status(404).json({
            status: 404,
            message: "No records"
          });
        } else {
          var replyMessage = {
            id: dbRes.rows[0].id,
            user: dbRes.rows[0].email,
            createdOn: dbRes.rows[0].request_date,
            status: dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            tenor: dbRes.rows[0].tenor,
            amount: dbRes.rows[0].loan_amount,
            paymentInstallment: dbRes.rows[0].paymentInstallment,
            balance: "balance",
            intrest: dbRes.rows[0].intrest,
          };
          return res.status(200).json({
            status: 200,
            data: [replyMessage]
          });
        }
      }
    });
  }

  static async userviewCurrentloan(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY);
    req.userData = decoded;
    var userRequestLoanid = req.userData.userid;

    await pool.query('SELECT * FROM loans WHERE userid = ($1)', [userRequestLoanid], (error, dbRes) => {
      if (error) {
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      } else {
        if (dbRes.rows[0] == null) {
          return res.status(404).json({
            status: 404,
            message: "You dont have a loan request"
          });
        } else {
          var replyMessage = {
            id: dbRes.rows[0].id,
            user: dbRes.rows[0].email,
            createdOn: dbRes.rows[0].request_date,
            status: dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            tenor: dbRes.rows[0].tenor,
            amount: dbRes.rows[0].loan_amount,
            paymentInstallment: dbRes.rows[0].paymentInstallment,
            balance: "balance",
            intrest: dbRes.rows[0].intrest,
          };
          return res.status(200).json({
            status: 200,
            data: [replyMessage]
          });
        }
      }
    });
  }

  static async acceptLoan(req, res) {
    try {
      const {
        status
      } = req.body;
      if (status === "rejected") {
        var repaid = "pending";
      } else if (status === "accepted") {
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
                loanAmount: dbRes.rows[0].loan_amount,
                tenor: dbRes.rows[0].tenor,
                status: dbRes.rows[0].status,
                monthlyInstallment: dbRes.rows[0].paymentinstallment,
                interest: dbRes.rows[0].intrest
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

  static async notfullyRepaid(req, res) {
    await pool.query('SELECT * FROM loans WHERE status=($1) AND repaid=($2)', [req.query.loan_status, req.query.repaid], (error, dbRes) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Internal server error"
        });
      } else {
        if (dbRes.rows[0] == undefined) {
          return res.status(404).json({
            status: 404,
            message: "No record found"
          });
        } else {
          const reply = {
            id: dbRes.rows[0].id,
            user: dbRes.rows[0].email,
            requestedOn: dbRes.rows[0].request_date,
            status: dbRes.rows[0].status,
            repaid: dbRes.rows[0].repaid,
            tenor: dbRes.rows[0].tenor,
            amount: dbRes.rows[0].loan_amount,
            paymentInstallment: dbRes.rows[0].paymentinstallment,
            balance: "balance",
            interest: dbRes.rows[0].intrest
          };
          return res.status(200).json({
            status: 200,
            data: [reply]
          });
        }
      }
    });
  }

}
export default LoanModel;