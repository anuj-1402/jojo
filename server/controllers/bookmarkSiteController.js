import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Site from '../models/sitesModel.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export const bookmarkSite = asyncHandler(async (req, res) => {
    // 1. Get token from cookies (changed from 'token' to 'accessToken')
    const token = req.cookies.accessToken;
    if (!token) {
        throw new ApiError(401, 'Not authenticated');
    }

    // 2. Verify token and get user ID (changed JWT_SECRET to ACCESS_TOKEN_SECRET and id to _id)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;

    // 3. Get siteId from request body
    const { siteId, notificationsEnabled } = req.body;
    if (!siteId) {
        throw new ApiError(400, 'siteId is required');
    }

    // Check if site exists
    const site = await Site.findById(siteId);
    if (!site) {
        throw new ApiError(404, 'Site not found');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const index = user.bookmarkedSites.findIndex(
        (b) => b.siteId.toString() === siteId
    );

    if (index === -1) {
        // Not bookmarked, add
        await User.findByIdAndUpdate(
            userId,
            { $push: { bookmarkedSites: { siteId, notificationsEnabled: false } } }
        );
        const updatedUser = await User.findById(userId);
        return res.status(200).json(
            new ApiResponse(200, updatedUser.bookmarkedSites, 'Site bookmarked')
        );
    } else {
        // Already bookmarked, remove
        await User.findByIdAndUpdate(
            userId,
            { $pull: { bookmarkedSites: { siteId } } }
        );
        const updatedUser = await User.findById(userId);
        return res.status(200).json(
            new ApiResponse(200, updatedUser.bookmarkedSites, 'Site unbookmarked')
        );
    }
});

export const notificationToggle = asyncHandler(async (req, res) => {
    // Changed from 'token' to 'accessToken'
    const token = req.cookies.accessToken;
    if (!token) throw new ApiError(401, 'Not authenticated');

    // Changed JWT_SECRET to ACCESS_TOKEN_SECRET and id to _id
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded._id;
    const { siteId } = req.body;

    if (!siteId) throw new ApiError(400, 'siteId is required');

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const bookmark = user.bookmarkedSites.find(
        (b) => b.siteId.toString() === siteId
    );
    if (!bookmark) throw new ApiError(404, 'Bookmark not found');

    // Toggle notificationsEnabled
    bookmark.notificationsEnabled = !bookmark.notificationsEnabled;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, bookmark, 'Notification preference toggled')
    );
});