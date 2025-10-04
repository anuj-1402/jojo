import mongoose from "mongoose";

const siteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    baseUrl: { type: String, required: true },   // Main site URL
    careersUrl: { type: String, required: true }, // Careers page URL
    logoUrl: { type: String },
    description: { type: String },

    // Store subscribers for email notification service 
    subscribedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Site active or not for scraping
    enabled: { type: Boolean, default: true },
    lastScrapedAt: { type: Date },
    scrapeFrequency: { type: String, default: "24h" }, // Frequency of scraping
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export default mongoose.model("Site", siteSchema);
