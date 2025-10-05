import express from 'express';
import { saveNotice } from '../utils/saveNotice.js';

const router = express.Router();

// POST /api/v1/test/save-notice
router.post('/save-notice', async (req, res) => {
  const { noticeData, siteId } = req.body;
  try {
    await saveNotice(noticeData, siteId);
    res.status(201).json({ success: true, message: 'Notice saved and notifications sent (if any).' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;