import express from 'express';
import { addSite } from '../controllers/siteController.js';

const router = express.Router();

// POST /api/v1/sites -> add a new site
router.post('/', addSite);

export default router;
