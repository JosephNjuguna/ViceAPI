const express = require('express');
const controllers = require('../controllers/users');
const router = express.Router();

router.route('/').get(controllers.welcome);
router.route('/signup').post(controllers.signup);
router.route('/login').post(controllers.login);
router.route('/users').get(controllers.allUsers);

module.exports = router;
