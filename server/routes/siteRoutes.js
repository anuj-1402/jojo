import express from 'express';
import { 
  addSite, 
  getAllSites, 
  getSiteById, 
  getSiteByName 
} from '../controllers/siteController.js';
import { bookmarkSite, notificationToggle } from '../controllers/bookmarkSiteController.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/v1/sites -> get all sites
router.get('/', getAllSites);

// GET /api/v1/sites/:id -> get single site by ID
router.get('/:id', getSiteById);

// GET /api/v1/sites/name/:name -> get site by name
router.get('/name/:name', getSiteByName);

// POST /api/v1/sites -> add a new site
router.post('/', addSite);

// POST /api/v1/sites/bookmark -> bookmark a site
router.post('/bookmark', verifyJWT, bookmarkSite);

// PATCH /api/v1/sites/notification -> toggle notification
router.patch('/notification', verifyJWT, notificationToggle);

export default router;
