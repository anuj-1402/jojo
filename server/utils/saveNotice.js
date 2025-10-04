import Notice from "../models/noticesModel.js";
import User from "../models/userModel.js";
import Site from "../models/sitesModel.js";
import sendEmail from "./sendEmail.js";

export async function saveNotice(noticeData, siteId) {
  try {
    const exists = await Notice.findOne({ title: noticeData.title, link: noticeData.link });
    if (!exists) {
      const notice = new Notice({ ...noticeData, site: siteId });
      await notice.save();
      console.log(`✅ Saved: ${notice.title}`);

      // Fetch site name using siteId
      const site = await Site.findById(siteId);

      // Find users who have bookmarked this site and enabled notifications
      const usersToNotify = await User.find({
        bookmarkedSites: {
          $elemMatch: {
            siteId: siteId,
            notificationsEnabled: true
          }
        }
      });

      // Send email to each user
      for (const user of usersToNotify) {
        await sendEmail({
          to: user.email,
          subject: `New Notice from JobScraper `,
          text: `A new notice by ${site?.name || "Site"} , Title : "${notice.title}" has been posted for a site you follow. Check it out: ${notice.link}`
        });
      }
    } else {
      console.log(`⚠️ Already exists: ${noticeData.title}`);
    }
  } catch (err) {
    console.error(`❌ Error saving notice ${noticeData.title}:`, err.message);
  }
}
