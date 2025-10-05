import express from "express";
import { scrapeAllJobs, scrapedDRDO } from "../controllers/jobController.js";

const router = express.Router();

router.post("/scrape", scrapeAllJobs);
router.post("/drdo", scrapedDRDO);

export default router;
