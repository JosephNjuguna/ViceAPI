import express from 'express';
import Authentication from '../controllers/users';
import Validations from '../middleware/validations';
import AuthValidator from '../middleware/checkauthentication';
const  router = express.Router();

router.get(
    '/welcome',
    Authentication.welcome
);
router.post(
    '/signup',  
    Validations.validatesignup,
    Authentication.signup
);
router.post(
    '/login',
    Validations.validatelogin,
    Authentication.login
);
router.get(
    '/userprofile',
    AuthValidator.checkUser,
    Authentication.userProfile
);
router.get(
    '/users',
    AuthValidator.checkAdmin,
    Authentication.allUsers
);
router.patch(
    '/users/:email/verify',
    AuthValidator.checkUser,
    Authentication.verifyuser
);
export default router;
