import Db from "../db/db";
import totalAmountdetail from '../helpers/Totalamount';

class LoanModel {

    constructor(payload = null) {
        this.payload = payload;
        this.result = null;
    }
    
    async requestloan() {
        const amount = parseFloat(this.payload.loan);
        const calculateTotalamount = totalAmountdetail.totalAmountdata(amount);
        const sql = `SELECT * FROM loans WHERE status='${status}' AND repaid='${repaidStatus}'`;
        const obj = await db.find(o => o.user === this.payload.email);
        if (!obj) {
            const loanInfo = {
                loanId: this.payload.loanId,
                firstname: this.payload.firstname,
                lastname: this.payload.lastname,
                user: this.payload.email,
                userId: this.payload.userId,
                tenor: calculateTotalamount.numberOfInstallments,
                principalAmount: amount,
                paymentInstallment: calculateTotalamount.installmentAmount,
                status: 'pending',
                totalAmounttopay: calculateTotalamount.totalamounttoPay,
                balance: 0,
                interestRate: calculateTotalamount.interestRate,
                requestedOn: this.payload.requestedOn,
            };
            db.push(loanInfo);
            this.result = loanInfo;
            return true;
        }
        return false;
    }

    static async userloanStatus(email) {
        const sql = `SELECT * FROM loans WHERE useremail ='${email}'`;
        const {
            rows
        } = await Db.query(sql);
        if (rows.length === 0) {
            return false
        }
        this.result = rows[0];
        return true;
    }

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

    async loanAcceptdetail(loanId, user, requestedOn, status, tenor, principalAmount, paymentInstallment, totalAmounttopay, interestRate, paidOn) {
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
        const sql = `SELECT * FROM loans WHERE loanid='${this.payload.userloanId}' AND useremail='${this.payload.email}'`;
        const obj = await Db.query(sql);
        if (obj) {
            const userLoanPayments = `SELECT * FROM loans WHERE loanid='${obj.loanid}'`;
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
                const sql = 'UPDATE loans SET repaid = ($1) WHERE loanid = $2 returning *;';
                const values = [status,email];
                const finishedPayment = await Db.query(sql,values)
                this.result = 'Thank for completing your loan payment';
                return true;
            }
            if (userLoanPayments.length === 1) {
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
                const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *';
                const {secondpayment} = await Db.query(sql)
                this.result = secondpayment[0];
                return true;
            } else {
                const newPaymentdetails = await this.continouedLoanpayment(obj.loanId, obj.user, obj.totalAmounttopay, amount, balance, paymentNo, this.payload.paidOn);
                const sql = 'INSERT INTO users (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *';
                const {payments} = await Db.query(sql);
                this.result = payments[0];
                return true;
            }
        }
        this.result = 'There was an error paying your loan';
        return false;
    }

    static async allLoanapplications() {
        const sql = 'SELECT * FROM loans';
        const { rows } = await Db.query(sql);
        if (rows) {
          const result = rows;
          return result;
        }
        return false
    }

    async oneloanapplication(loanid) {
        const sql = `SELECT * FROM loans WHERE loanid='${loanid}'`;
        const { rows } = await Db.query(sql);
        if (rows.length === 0) {
            return false
        }
        const result = rows[0];
        return result;
    }

    async acceptLoan(loanId, user, requestedOn, status, repaid, tenor, principalAmount, paymentInstallment, totalAmounttopay, interestRate) {
        const loanAccept = {
            loanId: loanId,
            user: user,
            requestedOn: requestedOn,
            status: status,
            repaid: repaid,
            tenor: tenor,
            principalAmount: principalAmount,
            paymentInstallment: paymentInstallment,
            totalAmounttopay: totalAmounttopay,
            balance: totalAmounttopay,
            interestRate: interestRate,
        };
        return loanAccept;
    }

    async acceptloans() {
        const status = this.payload.status;
        const obj = db.find(o => o.loanId === parseInt(this.payload.userloanId));
        if (!obj) {
            return false;
        }
        const aPayment = {
            loanId: obj.loanId,
            user: obj.user,
            amount: obj.totalAmounttopay,
            balance: obj.totalAmounttopay,
            paid: 0,
            paymentNo: 0,
        };
        const loanPaymentdata = 'INSERT INTO loans (userid, email, firstname, lastname, userpassword, address, status, isAdmin, signedupDate) VALUES($1, $2, $3, $4, $5 ,$6 ,$7 ,$8 ,$9) returning *';
        const values = aPayment;
        const paymentData = await Db.query(loanPaymentdata, values);
        console.log(paymentData);
        
        const loanAcceptdetail = await this.acceptLoan(obj.loanId, obj.user, obj.requestedOn, status, obj.repaid, obj.tenor, obj.principalAmount, obj.paymentInstallment, obj.totalAmounttopay, obj.interestRate);
        const sql = 'UPDATE loans SET repaid = ($1) WHERE loanid = $2 returning *;';
        const  { loanAccpetance } = await Db.query(sql, loanAcceptdetail);
        this.result = loanAccpetance;
        return true;
    }

    static async loanRepaidstatus(status, repaid) {
        let repaidStatus;
        if (repaid === 'false') {
            repaidStatus = false;
        } else if (repaid === 'true') {
            repaidStatus = true;
        }

        const sql = `SELECT * FROM loans WHERE status='${status}' AND repaid='${repaidStatus}'`;
        const {
            rows
        } = await Db.query(sql);
        if (rows.length === 0) {
            return false
        }
        this.result = rows[0];
        return true;
    }

    static async repaymentHistory(email, userloanId) {
        const sql = `SELECT * FROM payment WHERE email='${email}' && loanid='${userloanId}'`;
        const {
            rows
        } = await Db.query(sql);
        if (rows.length === 0) {
            return false
        }
        this.result = rows[0];
        return true;
    }

    static async allLoanpayments() {
        const sql = 'SELECT * FROM payments';
        const {
            rows
        } = await Db.query(sql);
        if (rows) {
            this.result = rows;
            return true;
        }
        return false
    }

}
export default LoanModel;