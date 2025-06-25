const User = require('../models/user.model');
const cloudinary = require('cloudinary').v2;

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  const { name, username, email } = req.body || {};

  try {
    // Check user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check username already exists
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    // Check email already exists
    if (email) {
      const existingEmailUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existingEmailUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Update data if provided
    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;

    // Update in cloudinary
    if (req.files?.profileImages) {
      // Delete old images from Cloudinary
      for (const oldImage of user.profileImages) {
        try {
          await cloudinary.uploader.destroy(oldImage.public_id);
        } catch (err) {
          console.warn(
            `[WARNING] Failed to delete image ${oldImage.public_id} from Cloudinary:`,
            err.message
          );
        }
      }

      // Save images
      user.profileImages = req.files.profileImages.map((file) => ({
        url: file.path,
        filename: file.filename,
        public_id: file.public_id || file.filename,
      }));
    }

    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete photo profile
exports.deletePhotoProfile = async (req, res) => {
  const public_id = req.query.public_id;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete in cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Delete in database
    const profileImages = user.profileImages.filter(
      (image) => image.public_id !== public_id
    );

    user.profileImages = profileImages;
    await user.save();
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
