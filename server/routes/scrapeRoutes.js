import express from "express";
import { scrapeAllJobs, scrapedDRDO } from "../controllers/scrapeController.js";

const router = express.Router();

router.post("/scrapeall", scrapeAllJobs);
router.post("/drdo", scrapedDRDO);

export default router;
