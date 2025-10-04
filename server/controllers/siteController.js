// server/controllers/siteController.js
import asyncHandler from "../utils/asyncHandler.js";
import Site from "../models/sitesModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";


export const addSite = asyncHandler(async (req, res) => {
  const { name, baseUrl, careersUrl, logoUrl, description, scrapeFrequency } = req.body;

  // Validation
  if (!name || !baseUrl || !careersUrl) {
    throw new ApiError(400, "Name, baseUrl, and careersUrl are required");
  }

  // Check if the site already exists
  const existingSite = await Site.findOne({ baseUrl });
  if (existingSite) {
    throw new ApiError(409, "Site with this base URL already exists");
  }

  // Create a new Site instance
  const site = new Site({
    name,
    baseUrl,
    careersUrl,
    logoUrl,
    description,
    scrapeFrequency
  });

  // Save to the database
  await site.save();

  // Return response
  return res.status(201).json(new ApiResponse(201, site, "Site added successfully"));
});


