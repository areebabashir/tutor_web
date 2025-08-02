import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'; // Importing routes
import teacherRoutes from './routes/teacherRoutes.js'; // Importing teacher routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes
app.use('/api/teachers', teacherRoutes); // Mount teacher routes

// Basic route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Tutor Web Application</h1>');
});

// Set the PORT from environment variables or default to 8000
const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
