import { upload } from "../middlewares/multer.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";   
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/userModel.js";

// Helper to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens");
  }
};

// Register user (PUBLIC)
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Only check required fields (remove profile photo requirement)
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  // Handle profile photo if provided (make it optional)
  let profilePhotoUrl;
  const profilePhotoLocalPath = req.files?.profilePhoto?.[0]?.path;
  
  if (profilePhotoLocalPath) {
    const profilePhotoResponse = await uploadOnCloudinary(profilePhotoLocalPath);
    if (!profilePhotoResponse) {
      throw new ApiError(400, "Profile photo upload failed");
    }
    profilePhotoUrl = profilePhotoResponse.url;
  }

  const user = new User({
    name,
    email,
    passwordHash: password,
    profilePhotoUrl, // This will be undefined if no photo provided
  });

  await user.save();

  const createdUser = await User.findById(user._id).select("-passwordHash -refreshToken");
  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// Register admin user (ADMIN ONLY)
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const profilePhotoLocalPath = req.files?.profilePhoto?.[0]?.path;
  if (!profilePhotoLocalPath) {
    throw new ApiError(400, "Profile photo is required");
  }

  const profilePhotoResponse = await uploadOnCloudinary(profilePhotoLocalPath);
  if (!profilePhotoResponse) {
    throw new ApiError(400, "Profile photo upload failed");
  }

  const admin = new User({
    name,
    email,
    role: "admin",
    passwordHash: password,
    profilePhotoUrl: profilePhotoResponse.url,
  });

  await admin.save();

  const createdAdmin = await User.findById(admin._id).select("-passwordHash -refreshToken");
  return res.status(201).json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
});

// Login user (PUBLIC)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-passwordHash -refreshToken");

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Logout user (PROTECTED)
export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Update user profile (PROTECTED)
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  // Build update object
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      throw new ApiError(400, "Email is already taken by another user");
    }
  }

  // Handle profile photo update
  const profilePhotoLocalPath = req.files?.profilePhoto?.[0]?.path;
  if (profilePhotoLocalPath) {
    const profilePhotoResponse = await uploadOnCloudinary(profilePhotoLocalPath);
    if (!profilePhotoResponse) {
      throw new ApiError(400, "Profile photo upload failed");
    }
    updateData.profilePhotoUrl = profilePhotoResponse.url;
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-passwordHash -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

// Change password (PROTECTED)
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCurrentPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.passwordHash = newPassword;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get current user profile (PROTECTED)
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-passwordHash -refreshToken")
    .populate("bookmarkedSites.siteId", "name baseUrl logoUrl");

  return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

