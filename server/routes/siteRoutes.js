import express from 'express';
import { addSite } from '../controllers/siteController.js';

const router = express.Router();

// GET /api/v1/sites -> get all sites (public)
router.get('/', (req, res) => {
  res.json({ message: 'Sites route working! Use POST to add a site.' });
});

// POST /api/v1/sites -> add a new site (public for scraping)
router.post('/', addSite);

export default router;
