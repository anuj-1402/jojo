// server/index.js
import dotenv from 'dotenv';
<<<<<<< HEAD
import connectDB from './config/database.js';
import jobRoutes from './routes/jobRoutes.js';
=======
import connectDB from './config/db.js';
import app from './app.js'; // import the Express app
>>>>>>> a176657141195f022bc63fdbd6a7e7e8316ddd47

dotenv.config({ path: '.env' });
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
