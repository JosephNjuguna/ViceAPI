import express from 'express';
import loans from '../controllers/Loans';
import validation from '../middleware/validations';
import checkAuth from '../middleware/auth';

const route = express.Router();

route.post('/requestloan',
	checkAuth.checkUser,
	validation.validateLoan,
	loans.requestLoan);

route.get('/viewloanrequest',
	checkAuth.checkUser,
	loans.userloanStatus);

route.post('/payloan/:loan_id',
	checkAuth.checkUser,
	validation.validateLoan,
	loans.payloan);

route.get('/loans',
	checkAuth.checkAdmin,
	loans.allLoanapplications);

route.get('/loan/:loan_id',
	checkAuth.checkAdmin,
	validation.validateID,
	loans.oneLoanapplication);

route.patch('/loan/:loan_id',
	checkAuth.checkAdmin,
	loans.acceptloans);

route.get('/loan',
	checkAuth.checkAdmin,
	loans.loanRepaidstatus);

route.get('/paymenthistory/:loan_id',
	checkAuth.checkUser,
	loans.repaymentHistory);



export default route;