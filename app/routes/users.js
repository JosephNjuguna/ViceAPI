const express = require('express');
const controllers = require('../controllers/users');
const validate  = require('../middleware/validations');
const { checkUser, checkAdmin } = require('../middleware/checkauthentication');
const router = express.Router();

router.get(
    '/',
    controllers.welcome
);
router.post(
    '/signup',  
    validate.validatesignup,
    controllers.signup
);
router.post(
    '/login',
    validate.validatelogin,
    controllers.login
);
router.get(
    '/user',
    checkUser,
    controllers.userProfile
);
router.get(
    '/users',
    checkAdmin,
    controllers.allUsers
);

module.exports = router;
