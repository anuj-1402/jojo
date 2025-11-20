import cron from 'node-cron';
import { scrapedISRO } from '../controllers/scrapeController.js';
import { scrapedDRDO } from '../controllers/scrapeController.js';

// Run ISRO scraper every day at 9:00 AM
export const scheduleISROScraper = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('🚀 Running ISRO scraper at:', new Date().toLocaleString());
    try {
      await scrapedISRO();
      console.log('✅ ISRO scraper completed successfully');
    } catch (error) {
      console.error('❌ ISRO scraper failed:', error);
    }
  });
  console.log('📅 ISRO scraper scheduled for 9:00 AM daily');
};

// Run DRDO scraper every day at 10:00 AM
export const scheduleDRDOScraper = () => {
  cron.schedule('0 10 * * *', async () => {
    console.log('🚀 Running DRDO scraper at:', new Date().toLocaleString());
    try {
      await scrapedDRDO();
      console.log('✅ DRDO scraper completed successfully');
    } catch (error) {
      console.error('❌ DRDO scraper failed:', error);
    }
  });
  console.log('📅 DRDO scraper scheduled for 10:00 AM daily');
};

