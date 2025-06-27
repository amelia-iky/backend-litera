const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { authentication } = require('../middleware/authentication.middleware');
const User = require('../models/user.model');

// Signup
router.post('/signup', auth.signup);

// Signin
router.post('/signin', auth.signin);

// Keep Login
router.get('/keep-login', authentication(), auth.keepLogin);

// Signout
router.post('/signout', authentication(), auth.signout);

module.exports = router;
