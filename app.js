const cors = require('cors');
const path = require('path');
const express = require('express');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
require('dotenv').config();

// Create app
const app = express();

// Middleware CORS & Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true,
  })
);

// Middleware Logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// For testing only
app.get('/', (_req, res) => {
  res.send('Litera API is running!');
});

// Call routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

module.exports = app;
