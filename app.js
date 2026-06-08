const express = require('express');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default API route check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Blog REST API' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred on the server.' });
});

module.exports = app;
