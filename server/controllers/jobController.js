import {saveJob} from '../utils/saveJob.js';

export async function getJobs(req, res) {
    try {
        const jobs = await saveJob();
        res.status(200).json( {success: 'successfully stored jobs'});
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
}
