import Job from '../models/noticesModel.js';
import Site from '../models/sitesModel.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllNotices = asyncHandler(async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(200, jobs, "Jobs fetched successfully")
  );
});

export const getNoticesBySite = asyncHandler(async (req, res) => {
  const { siteName } = req.params;

  // Find the site by name (case-insensitive)
  const site = await Site.findOne({ name: new RegExp(`^${siteName}$`, "i") });
  
  if (!site) {
    return res.status(404).json(
      new ApiResponse(404, null, "Site not found")
    );
  }

  // Find all notices for this site
  const jobs = await Job.find({ site: site._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, jobs, "Jobs fetched successfully")
  );
});
