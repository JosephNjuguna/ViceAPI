const express = require('express');
const controllers = require('../controllers/users');
const validate  = require('../middleware/validations');
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
    '/users',
    controllers.allUsers
);

module.exports = router;
