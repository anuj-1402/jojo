import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async(req, _, next) => {
    try {
        // Check if user exists (should be set by verifyJWT middleware)
        if (!req.user) {
            throw new ApiError(401, "User not authenticated")
        }
        
        // Check if user has admin role
        if (req.user.role !== "admin") {
            throw new ApiError(403, "Access denied. Admin privileges required.")
        }
        
        next()
    } catch (error) {
        throw new ApiError(403, error?.message || "Access denied")
    }
})