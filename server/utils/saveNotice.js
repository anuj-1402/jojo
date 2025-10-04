import Notice from "../models/noticesModel.js";

export async function saveNotice(noticeData, siteId) {
  try {
    const exists = await Notice.findOne({ title: noticeData.title, link: noticeData.link });
    if (!exists) {
      const notice = new Notice({ ...noticeData, site: siteId });
      await notice.save();
      console.log(`✅ Saved: ${notice.title}`);
    } else {
      console.log(`⚠️ Already exists: ${noticeData.title}`);
    }
  } catch (err) {
    console.error(`❌ Error saving notice ${noticeData.title}:`, err.message);
  }
}
