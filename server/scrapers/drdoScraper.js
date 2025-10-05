import axios from "axios";
import * as cheerio from "cheerio";
import Site from "../models/sitesModel.js";
import { saveNotice } from "../utils/saveNotice.js";
import {parseDate} from "../utils/parseDate.js"
import { generateExternalId } from "../utils/genrateExternalId.js";

export async function scrapeDRDO() {

    const url = "https://drdo.res.in/drdo/en/offerings/vacancies";
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const site = await Site.findOne({ name: "DRDO" });
    if (!site) {
      console.error("❌ DRDO site not found in DB. Please create one in your sites collection.");
      return;}

    
    $('.vacanciess-box').each(async (i, el) => {
        const box = $(el);
        const title = box.find('.vacanciess-title').text().trim();
        const link = box.find('.vacanciess-view-node a').attr('href') || "";
        const advNo = box.find('.vacanciess-advertisment-no-content').text().trim() || generateExternalId(title, link);
        const openDate = box.find('.vacanciess-start-date-content time').attr('datetime') || box.find('.vacanciess-start-date-content time').text().trim();
        const endDateText = box.find('.vacanciess-due-date-content').text().trim();
     

        
        const endDate = parseDate(endDateText);
        
        // 1️⃣ Split the title by spaces
        const words = title.trim().split(/\s+/);

// 2️⃣ Take the last word
        const location = words[words.length - 1];

      await saveNotice(
        {
          title,
          link,
          location,
          externalId: advNo,
          openDate,
          endDate,
      
        },
        site._id
      );

      
    });

    console.log(`✅ DRDO scraping completed. Total unique`);
  } catch (error) {
    console.error("❌ Error scraping DRDO site:", error.message);
  }
}
