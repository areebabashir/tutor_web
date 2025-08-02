import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Importing routes
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes
// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the E-commerce App</h1>');
});

// Set the PORT from environment variables or default to 8000
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
