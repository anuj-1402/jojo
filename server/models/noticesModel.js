import mongoose from "mongoose";
//schema for each new notice 
const noticeSchema = new mongoose.Schema({
  site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },

  title: { type: String, required: true },
  url: { type: String, required: true },           // main link to notice
  externalId: { type: String, index: true },      // hash  to avoid duplicates
  moreDetails: { type: String },                  // optional direct PDF / advertisement link

  publishedAt: { type: Date },
  endDate: { type: Date },
  scrapedAt: { type: Date, default: Date.now },

  summary: { type: String },
  rawHtml: { type: String },

  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ensures no duplicate notice for same site
noticeSchema.index({ site: 1, externalId: 1 }, { unique: true });

export default mongoose.model("Notice", noticeSchema);
