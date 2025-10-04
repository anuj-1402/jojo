import { scrapeISRO } from "../scrapers/isroScraper.js";

export async function scrapeAllJobs(req, res) {
  try {
    await scrapeISRO();
    
    

    res.status(200).json({ message: "All jobs scraped successfully" });
  } catch (err) {
    console.error("❌ Error scraping jobs:", err);
    res.status(500).json({ error: err.message });
  }
}
