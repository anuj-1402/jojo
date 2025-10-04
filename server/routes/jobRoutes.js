import express from "express";
import { scrapeAllJobs } from "../controllers/jobController.js";

const router = express.Router();

router.post("/scrape", scrapeAllJobs);

export default router;
