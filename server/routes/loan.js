import express from 'express';
import Validations from '../middleware/validations';
import Authentication from '../middleware/checkauthentication'
import Loan from '../controllers/loans';

const router = express.Router();

router.post('/requestloan',
    Authentication.checkUser,
    Validations.validateLoan,
    Loan.requestLoan
);

router.get('/viewcurrentloan',
    Loan.userviewCurrentloan
);

router.get('/loans',
    Authentication.checkAdmin,
    Loan.getAllloans
);

router.get('/loans/:loan_id',
    Authentication.checkAdmin,
    Loan.getSingleloan
);

router.patch('/loan/:loan_id',
    Authentication.checkAdmin,
    Loan.acceptLoan
);

router.get('/notfullyrepaid',
    Loan.notfullyRepaid
); 

export default router;