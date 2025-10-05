import { scrapeISRO } from "../scrapers/isroScraper.js";
import { scrapeDRDO } from "../scrapers/drdoScraper.js";

export async function scrapeAllJobs(req, res) {
  try {
    await scrapeISRO();
    
    

    res.status(200).json({ message: "All jobs scraped successfully" });
  } catch (err) {
    console.error("❌ Error scraping jobs:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function scrapedDRDO(req, res) {
    try {
      await scrapeDRDO();
      
  
      res.status(200).json({ message: "DRDO scraped and saved successfully" });
    } catch (err) {
      console.error("❌ Error scraping jobs:", err);
      res.status(500).json({ error: err.message });
    }
  }
