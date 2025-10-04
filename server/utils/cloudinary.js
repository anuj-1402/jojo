import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        
        // Upload to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // Delete local file after upload
        fs.unlinkSync(localFilePath)
        return response;  // Contains response.url
    } catch (error) {
        fs.unlinkSync(localFilePath) // Clean up on error
        return null;
    }
}

export { uploadOnCloudinary };