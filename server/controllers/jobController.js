import {scrapeAll} from '../scrapers/allScraped.js';

export async function getJobs(req, res) {
    try {
        const jobs = await scrapeAll();
        res.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
}
