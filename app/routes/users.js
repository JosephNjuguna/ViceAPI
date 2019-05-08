import express from 'express';
import controllers from '../controllers/Users';
import validate from '../middleware/validations';
import Auth from '../middleware/auth';

const router = express.Router();

router.post('/signup', validate.validatesignup, controllers.signup);
router.post('/login', validate.validatelogin, controllers.login);
router.get('/profile', Auth.checkUser, controllers.userProfile);
router.get('/users', Auth.checkAdmin, controllers.allUsers );
router.get('/users/:userid', Auth.checkAdmin, controllers.oneUser);

export default router;
