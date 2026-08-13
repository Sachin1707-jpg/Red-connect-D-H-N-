require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('RedConnect Backend API is running...');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
