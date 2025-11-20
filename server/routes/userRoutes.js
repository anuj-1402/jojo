import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyAdmin } from '../middlewares/admin.middleware.js';
import { 
  registerUser, 
  registerAdmin,
  loginUser, 
  logoutUser, 
  updateUserProfile, 
  changePassword, 
  getCurrentUser,
  getBookmarkedSites,
  refreshAccessToken
} from '../controllers/userController.js';
import User from '../models/userModel.js'; // Import the User model

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', upload.fields([{ name: 'profilePhoto', maxCount: 1 }]), registerUser);
router.post('/login', loginUser);

// Admin-only routes (requires authentication + admin role)
router.post('/register-admin', verifyJWT, verifyAdmin, upload.fields([{ name: 'profilePhoto', maxCount: 1 }]), registerAdmin);

// Protected routes (requires authentication)
router.post('/logout', verifyJWT, logoutUser);
router.get('/profile', verifyJWT, getCurrentUser);
router.patch('/update-profile', verifyJWT, upload.fields([{ name: 'profilePhoto', maxCount: 1 }]), updateUserProfile);
router.patch('/change-password', verifyJWT, changePassword);
router.get('/bookmarks', verifyJWT, getBookmarkedSites);
router.post('/refresh', refreshAccessToken);
router.get('/count', async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
});

export default router;