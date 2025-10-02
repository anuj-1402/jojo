import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  baseUrl: { type: String, required: true },   // Main site URL
  careersUrl: { type: String, required: true }, // Careers page URL
  logoUrl: { type: String },
  description: { type: String },

  //  for automated scraping
  scrapingConfig: {
    type: {
      type: String,
      enum: ["static", "dynamic"],
      default: "static"
    },
    listSelector: { type: String },          
    titleSelector: { type: String },
    linkSelector: { type: String },
    dateSelector: { type: String },
    endDateSelector: { type: String },
    moreDetailsSelector: { type: String },
    externalIdSelector: { type: String },     
    paginationSelector: { type: String }     
  },

  // Store subscribers for email notification service 
  subscribedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Site active or not for scraping
  enabled: { type: Boolean, default: true },
  lastScrapedAt: { type: Date },
  scrapeFrequency: { type: String, default: "24h" }, // Frequency of scraping

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Site", siteSchema);
