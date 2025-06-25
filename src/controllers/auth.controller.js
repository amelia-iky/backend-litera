const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
require('dotenv').config();

// Signup
exports.signup = async (req, res) => {
  const { name, username, email, password } = req.body;
  try {
    // Check if email already exists
    const user = await User.findOne({ username, email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'Username orEmail already exists' });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create data
    const createdUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ createdUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Username not found' });
    }

    // Check if password is correct
    const match = await argon2.verify(user.password, password);
    if (!match) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.header(`Authorization`, `Bearer ${token}`).status(200).json({
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
exports.signout = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const { blacklist } = require('../middleware/authentication.middleware');
  blacklist.push(token);

  return res.status(200).json({ message: 'Logged out successfully' });
};
