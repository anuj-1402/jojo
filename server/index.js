// server/index.js
import dotenv from 'dotenv';
import connectDB from './config/database.js';

import app from './app.js'; // import the Express app


dotenv.config({ path: '.env' });
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
