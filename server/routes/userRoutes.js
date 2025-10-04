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
  getCurrentUser 
} from '../controllers/userController.js';

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

export default router;