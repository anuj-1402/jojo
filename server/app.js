//example// server/app.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jobRoutes from './routes/jobRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: true, // Allow all origins
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/sites', siteRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/test', testRoutes);

// Add a root route for welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Job Scraper API! 🚀' });
});

// Error handling middleware (add this AFTER routes)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle ApiError
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  }
  
  // Handle other errors
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

// Export the app
export default app;
