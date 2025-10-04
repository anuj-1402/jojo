import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config(
  {path: '.env',}
);
connectDB();

const app = express();
const PORT = process.env.PORT;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  creditials: true,
};
app.use(cors(corsOptions));

app.use('/api/v1/jobs', jobRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});