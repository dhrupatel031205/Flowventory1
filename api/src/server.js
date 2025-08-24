import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import brandRoutes from './routes/brands.js';
import categoryRoutes from './routes/categories.js';
import userRoutes from './routes/users.js';
import logRoutes from './routes/logs.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration - allow both local development and Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flowventory';

// Connect to MongoDB (only if not already connected)
let dbConnection = null;

const connectDB = async () => {
  if (dbConnection) return dbConnection;
  
  try {
    dbConnection = await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    return dbConnection;
  } catch (err) {
    console.error('Mongo connection error:', err);
    throw err;
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// For Vercel serverless deployment
export default async function handler(req, res) {
  try {
    // Connect to database for each request in serverless environment
    await connectDB();
    
    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
