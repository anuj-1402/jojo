import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  role: { type: String, enum: ["user", "admin"], default: "user" },
  passwordHash: { type: String, required: true },//hashed bycrypt pass
  profilePhotoUrl: { type: String },//profile photo URL
  refreshToken: { type: String },//JWT refresh token
  bookmarkedSites: [bookmarkedSiteSchema], //array for bookmarked sites with notifivation preference
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};


userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export default mongoose.model("User", userSchema);

