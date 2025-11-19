import express from 'express';
import { getAllNotices ,getNoticesBySite} from '../controllers/noticeController.js';
const router = express.Router();
router.get('/getnotices', getAllNotices);
router.get('/getnotices/:siteName', getNoticesBySite);
export default router;
