import express from 'express';
import { getAllJobs ,getJobsBySite} from '../controllers/jobController.js';
const router = express.Router();
router.get('/getjobs', getAllJobs);
router.get('/getjobs/:siteName', getJobsBySite);
export default router;
