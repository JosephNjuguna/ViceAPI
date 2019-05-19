import Db from '../db/db';
import totalAmountdetail from '../helpers/Totalamount';

class LoanModel {
  constructor(payload = null) {
    this.payload = payload;
    this.result = null;
  }

  static async requestLoan({
    requestedloan,
    userid,
    dateRequested,
    loanrequestedId
  }) {
    const amount = parseFloat(requestedloan);
    const calculateTotalamount = totalAmountdetail.totalAmountdata(amount);
    const sqlInsert = 'INSERT INTO loans (loanid, userid, requestedOn,status,repaid,tenor,principalAmount,paymentInstallment,totalAmounttopay,intrestRate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10)  returning *';
    const values = [loanrequestedId, userid, dateRequested, 'pending', false, calculateTotalamount.numberOfInstallments, amount, calculateTotalamount.installmentAmount, calculateTotalamount.totalamounttoPay, calculateTotalamount.interestRate];
    const { rows } = await Db.query(sqlInsert, values);
    this.result = rows;
    return true;
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

  static async allLoanapplications() {
    const {
      rows
    } = await Db.query('SELECT * FROM loans');
    if (rows.length == 0) {
      return false;
    }
    return true
  }

  static async oneLoanapplication(userloanId) {
    const { rows } = await Db.query(`SELECT * FROM loans WHERE loanid ='${userloanId}'`);
    if (rows.length === 0) {
      return false;
    }
    return true;
  }
  static async paymentDetail(loanid, userid, paidOn, totalamounttoPay){
    const sql = 'INSERT INTO payments(loanid, userid, paidOn, status, repaid, principalAmount, balance, paid, paymentNo ) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *';
    const values = [loanid, userid, paidOn, 'accepted', "false", totalamounttoPay, totalamounttoPay, 0, 0];
    const { rows } = await Db.query(sql, values);
  }

  static async loanAccepted(status, loanid){
    const rowData = 'UPDATE loans SET status = ($1) WHERE loanid = ($2) returning *;';
    const valuesUpdate = [status, loanid];
    const { rows } = await Db.query(rowData, valuesUpdate);
    return true;
  }

  static async acceptloanapplication(userloanId, status, paidOn) {
    const { rows } = await Db.query(`SELECT * FROM loans WHERE loanid ='${userloanId}'`);
    if (rows.length === 0) {
      return false;
    }
    const paymentFunction = await this.paymentDetail(rows[0].loanid, rows[0].userid, paidOn, rows[0].totalamounttopay );
    const loanAcceptance = await this.loanAccepted(status, rows[0].loanid);
    return loanAcceptance;
  }

  static async loanRepaidstatus(status, repaid) {
    let repaidStatus;
    if (repaid === 'false') {
      repaidStatus = false;
    } else if (repaid === 'true') {
      repaidStatus = true;
    }
    const sql = `SELECT * FROM loans WHERE status ='${status} AND repaid = '${repaidStatus}'`;
    const {
      obj
    } = await Db.query(sql);
    if (obj.length === 0) {
      return false;
    }
    this.result = obj;
    return true;
  }

  static async repaymentHistory(userRequestLoanid, userid) {
    const {
      rows
    } = await pool.query('SELECT * FROM payments WHERE status=($1) AND repaid=($2)', [userRequestLoanid, userid]);
    if (rows.length === 0) {
      this.result = "There are no any loan payments"
      return false;
    }
    this.result = payments;
    return true;
  }

  static async allLoanpayments() {
    const {
      rows
    } = await pool.query('SELECT * FROM payments');
    if (rows.length === 0) {
      this.result = "There are no any loan payments"
      return false;
    }
    this.result = payments;
    return true;
  }
  // work on this.
  async secondLoanpayment(loanId, user, totalAmounttopay, amount, balance, paidOn) {
    const secondPayment = {
      loanId: loanId,
      user: user,
      amount: totalAmounttopay,
      installmentsAmount: amount,
      balance: balance,
      paymentNo: 2,
      paidOn,
    };
    return secondPayment;
  }

  async continouedLoanpayment(loanId, user, totalAmounttopay, amount, balance, paymentNo, paidOn) {
    const continousPayment = {
      loanId: loanId,
      user: user,
      amount: totalAmounttopay,
      installmentsAmount: amount,
      balance: balance,
      paymentNo: paymentNo,
      paidOn,
    };
    return continousPayment;
  }

  async loanAcceptdetailpay(loanId, user, requestedOn, status, tenor, principalAmount, paymentInstallment, totalAmounttopay, interestRate, paidOn) {
    const loanAccept = {
      loanId: loanId,
      user: user,
      requestedOn: requestedOn,
      status: status,
      repaid: true,
      tenor: tenor,
      principalAmount: principalAmount,
      paymentInstallment: paymentInstallment,
      totalAmounttopay: totalAmounttopay,
      balance: totalAmounttopay,
      interestRate: interestRate,
      paidOn,
    };
    return loanAccept;
  }

  async payloan() {
    const amount = parseFloat(this.payload.loanInstallment);
    const sql = `SELECT * FROM loans WHERE loanid ='${this.payload.userloanId} AND userid = '${this.payload.userid}'`;
    const {
      obj
    } = await Db.query(sql);
    if (obj) {
      const userLoanPayments = payments.filter(o => o.loanId = obj.loanId);
      const paymentsCount = userLoanPayments.length;
      const latestPayment = userLoanPayments[paymentsCount - 1];
      const balance = latestPayment.balance - amount;
      const paymentNo = paymentsCount + 1;

      if (userLoanPayments.length === 0) {
        this.result = 'kindly wait for your application to be accepted';
        return false;
      }

      if (latestPayment.balance === 0) {
        const loanpaymentDetail = await this.loanAcceptdetail(obj.loanId, obj.user, obj.requestedOn, obj.status, obj.tenor, obj.principalAmount, obj.paymentInstallment, obj.totalAmounttopay, obj.interestRate, this.payload.paidOn);
        const values = [loanpaymentDetail.loanId, loanpaymentDetail.user, loanpaymentDetail.requestedOn, loanpaymentDetail.status, loanpaymentDetail.tenor, loanpaymentDetail.principalAmount, loanpaymentDetail.paymentInstallment, loanpaymentDetail.totalAmounttopay, loanpaymentDetail.interestRate, loanpaymentDetail.paidOn];

        const sql = 'INSERT INTO loans (loanid, userid, requestedOn,status,repaid,tenor,principalAmount,paymentInstallment,totalAmounttopay,intrestRate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9, $10) returning *;';
        const {
          result
        } = await Db.query(sql, values);
        console.log(result);
        const payment = userLoanPayments[0];
        if (payment.paymentNo === 0) {
          const newPayment = {
            loanId: obj.loanId,
            user: obj.user,
            amount: obj.totalAmounttopay,
            installmentsAmount: payment.paid = amount,
            balance: payment.balance = obj.totalAmounttopay - amount,
            paymentNo: payment.paymentNo = 1,
            paidOn: this.payload.paidOn,
          };
          this.result = newPayment;
          return true;
        }

        const secondLoanpaymentdetails = await this.secondLoanpayment(obj.loanId, obj.user, obj.totalAmounttopay, amount, balance, this.payload.paidOn);
        payments.push(secondLoanpaymentdetails);
        this.result = secondLoanpaymentdetails;
        return true;

      } else {
        const newPaymentdetails = await this.continouedLoanpayment(obj.loanId, obj.user, obj.totalAmounttopay, amount, balance, paymentNo, this.payload.paidOn);
        payments.push(newPaymentdetails);
        this.result = newPaymentdetails;
        return true;
      }
    }
    this.result = 'There was an error paying your loan';
    return false;
  }

}
export default LoanModel;