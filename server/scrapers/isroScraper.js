import axios from "axios";
import * as cheerio from "cheerio";
import Site from "../models/sitesModel.js";
import { saveNotice } from "../utils/saveNotice.js";


export async function scrapeISRO() {
  const baseUrl = "https://www.isro.gov.in/ViewAllOpportunities.html";
  const { data } = await axios.get(baseUrl);
  const $ = cheerio.load(data);
  const site = await Site.findOne({ name: "ISRO - Indian Space Research Organisation" });
  if (!site) return console.error("ISRO site not found");

 
  $("tbody.list tr").each(async (_, el) => {
    const row = $(el);

    const location = row.find("td.location").text().trim();
    const titleText = row.find("td.post").text().trim();
    const advNo = row.find("td.advNo").text().trim();
    const openDateText = row.find("td.openDate").text().trim();
    const closeDateText = row.find("td.closeDate").text().trim();

    const openDate = openDateText ? new Date(openDateText) : null;
    const closeDate = closeDateText ? new Date(closeDateText) : null;

    const button = row.find("td.moreDetails button");
    let link = button.attr("onclick") || "";
    link = link.match(/'(.+?)'/)?.[1] || baseUrl;
    link = new URL(link, baseUrl).href;

    const title = `${advNo} - ${titleText}`;

    await saveNotice({
      title,
      link,
      location,
      externalId: advNo,
      openDate,
      closeDate,
    }, site._id);
  });
  console.log("✅ ISRO scraping completed");
}
