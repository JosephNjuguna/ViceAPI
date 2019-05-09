import express from 'express';
import checkAuth from '../middleware/auth';
import loans from '../controllers/Loans';

const route = express.Router();

route.get('/payments',
    checkAuth.checkAdmin,
    loans.allLoanpayments
)

export default route;