const router = require('express').Router();
const user = require('../controllers/user.controller');
const { authentication } = require('../middleware/authentication.middleware');
const { upload } = require('../configs/cloudinary.config');

// Get profile
router.get('/profile', authentication(), user.getProfile);

// Update profile
router.put(
  '/profile-update',
  authentication(),
  upload.fields([{ name: 'profileImages', maxCount: 1 }]),
  (req, res) => {
    user.updateProfile(req, res);
  }
);

module.exports = router;
