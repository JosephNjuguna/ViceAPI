import jwt from 'jsonwebtoken';
import Models from '../models/Loans';
import userDate from '../helpers/Date';
import Userid from '../helpers/Uid';
import reqResponses from '../helpers/Responses';
import Token from '../helpers/Token';

const loanId = Userid.uniqueId();
const requestedDate = userDate.date();

class Loans {
	static async requestLoan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const loan = req.body.amount;
			const requestedloan = loan;
			const {
				firstname
			} = req.userData;
			const {
				lastname
			} = req.userData;
			const {
				email
			} = req.userData;
			const {
				userid
			} = req.userData;
			const dateRequested = requestedDate;
			const loanrequestedId = loanId;

			const loanModel = await Models.requestloan(
				requestedloan,
				firstname,
				lastname,
				email,
				userid,
				dateRequested,
				loanrequestedId,
			);
			console.log(loanModel);
			if (loanModel) {
				reqResponses.handleSuccess(200, 'Loan request successful', await loanModel.result, res);
			}
			return reqResponses.handleError(409, 'You cant request loan twice. You already have a loan request.', res);
		} catch (error) {
			console.log(error);
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async userloanStatus(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const loanStatus = await Models.userloanStatus(req.userData.email);
			console.log('passwed 1');

			if (!loanStatus) {
				return reqResponses.handleError(404, loanStatus.result, res);
			}
			reqResponses.handleSuccess(200, 'success', loanStatus.result, res);
		} catch (error) {
			console.log(error.toString());
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async payloan(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;
			const loanModel = new Models({
				email: req.userData.email,
				loanInstallment: req.body.amount,
				paidOn: requestedOn,
				userloanId: req.params.loan_id,
			});

			if (!await loanModel.payloan()) {
				return reqResponses.handleError(404, loanModel.result, res);
			}
			reqResponses.handleSuccess(200, 'loan payment successful', loanModel.result, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async allLoanapplications(req, res) {
		try {
			const loanData = await Models.allLoanapplications();
			if (!loanData) {
				return reqResponses.handleError(404, 'No records found', res);
			}
			return reqResponses.handleSuccess(200, 'Loan Applications Records', loanData, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async oneLoanapplication(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const oneloanData = await Models.oneLoanapplication(userloanId);
			if (!oneloanData) {
				return reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'success', oneloanData, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async acceptloans(req, res) {
		try {
			const userloanId = req.params.loan_id;
			const {
				status,
			} = req.body;
			const acceptLoan = await Models.acceptloans(userloanId, status);
			console.log('passwed 4');
			if (!acceptLoan) {
				return reqResponses.handleError(404, 'Loan id not found', res);
			}
			return reqResponses.handleSuccess(200, 'loan accepted successfully', acceptLoan, res);
		} catch (error) {
			console.log(error.toString());

			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async loanRepaidstatus(req, res) {
		try {
			const {
				status,
				repaid,
			} = req.query;
			const loanstatus = await Models.loanRepaidstatus(status, repaid);
			console.log('passwed 5');
			if (!loanstatus) {
				return reqResponses.handleError(404, 'No loans records found', res);
			}
			reqResponses.handleSuccess(200, 'loan status', loanstatus.result, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async repaymentHistory(req, res) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_KEY);
			req.userData = decoded;

			const {
				email,
			} = req.userData;
			const userloanId = req.params.loan_id;

			const paymentHistory = await Models.repaymentHistory(email, userloanId);
			console.log('passwed 5');
			if (!paymentHistory) {
				return reqResponses.handleError(404, 'Loan id not found', res);
			}
			reqResponses.handleSuccess(200, 'Loan Repayment Record ', paymentHistory.result, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}

	static async allLoanpayments(req, res) {
		try {
			const loanData = await Models.allLoanpayments();
			console.log('passwed 6');
			if (!loanData) {
				return reqResponses.handleError(404, loanData.result, res);
			}
			reqResponses.handleSuccess(200, 'Loan Repayment History Record ', loanData.result, res);
		} catch (error) {
			reqResponses.handleError(500, error.toString(), res);
		}
	}
}

export default Loans;