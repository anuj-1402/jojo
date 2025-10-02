//user model 
import mongoose from "mongoose";
//sub schema for bookmarked sites with notification preference
const bookmarkedSiteSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
  notificationsEnabled: { type: Boolean, default: true },
  bookmarkedAt: { type: Date, default: Date.now }
});

//actual user schema 
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },//hashed bycrypt pass
  bookmarkedSites: [bookmarkedSiteSchema], //array for bookmarked sites with notifivation preference
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
