const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { authentication } = require('../middleware/authentication.middleware');
const User = require('../models/user.model');

// Signup
router.post('/signup', (req, res) => {
  auth.signup(req, res);
});

// Signin
router.post('/signin', (req, res) => {
  auth.signin(req, res);
});

// Keep Login
router.get('/keep-login', authentication(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
