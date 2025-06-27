const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user.model');
const { blacklist } = require('../middleware/authentication.middleware');
require('dotenv').config();

// Signup
exports.signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Input validation
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password validation
    const isPasswordValid =
      password.length >= 6 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message:
          'Password must be at least 6 characters and contain letters and numbers',
      });
    }

    // Check data user
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res
        .status(400)
        .json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create data
    const data = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ data });
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

// Keep Login
exports.keepLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Create new token
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

// Signout
exports.signout = (req, res) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }

    blacklist.push(token);
    return res.status(200).json({ message: 'Signout successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};