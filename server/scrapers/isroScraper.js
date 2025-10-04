import axios from "axios";
import * as cheerio from "cheerio";
import Site from "../models/Site.js";
import { saveNotice } from "../utils/saveNotice.js";

export async function scrapeISRO() {
  const baseUrl = "https://www.isro.gov.in/ViewAllOpportunities.html";
  const { data } = await axios.get(baseUrl);
  const $ = cheerio.load(data);

  // Get site ObjectId for ISRO
  const isroSite = await Site.findOne({ code: "ISRO" });
  if (!isroSite) return console.error("ISRO site not found");

  $("tbody.list tr").each(async (_, el) => {
    const row = $(el);

    const location = row.find("td.location").text().trim();
    const titleText = row.find("td.post").text().trim();
    const advNo = row.find("td.advNo").text().trim();
    const openDateText = row.find("td.openDate").text().trim();
    const closeDateText = row.find("td.closeDate").text().trim();

    // parse dates
    const openDate = openDateText ? new Date(openDateText) : null;
    const closeDate = closeDateText ? new Date(closeDateText) : null;

    // extract link from button onclick
    const button = row.find("td.moreDetails button");
    let link = button.attr("onclick") || "";
    link = link.match(/'(.+?)'/)?.[1] || baseUrl;
    link = new URL(link, baseUrl).href;

    // Combine advNo + title for uniqueness
    const title = `${advNo} - ${titleText}`;

    // Prepare notice object
    const noticeData = {
      title,
      link,
      location,
      advNo,
      openDate,
      closeDate,
    };

    // Save notice
    await saveNotice(noticeData, isroSite._id);
  });
}
