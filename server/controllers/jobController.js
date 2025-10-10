import Job from '../models/noticesModel.js';
import Site from '../models/sitesModel.js';

export async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (err) {
    console.error('❌ Error fetching jobs:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export const getJobsBySite = async (req, res) => {
  try {
    const { siteName } = req.params;

    // Find the site by name (case-insensitive)
    const site = await Site.findOne({ name: new RegExp(`^${siteName}$`, "i") });
    if (!site) {
      return res.status(404).json({ message: "Site not found" });
    }

    // Find all notices for this site
    const jobs = await Job.find({ site: site._id })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    res.status(200).json({
     jobs
    });
  } catch (error) {
    console.error("Error fetching jobs for site:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
