import cron from 'node-cron';
import axios from 'axios';

export const scheduleRenderPing = () => {
    const RENDER_URL = process.env.RENDER_BACKEND_URL || 'https://your-backend-url.onrender.com';
    
    // Run every 14 minutes
    cron.schedule('*/14 * * * *', async () => {
      try {
        const response = await axios.get(`${RENDER_URL}/health`);
      } catch (error) {
        console.error('❌ Render ping failed:', error.message);
      }
    });
  };