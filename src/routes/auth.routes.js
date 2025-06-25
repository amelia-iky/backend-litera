const router = require('express').Router();
const auth = require('../controllers/auth.controller');

router.post('/signup', auth.signup);

router.post('/signin', (req, res) => {
  auth.signin(req, res);
});

module.exports = router;
