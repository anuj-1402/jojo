import axios from "axios";
import * as cheerio from "cheerio";
import Site from "../models/sitesModel.js";
import { saveNotice } from "../utils/saveNotice.js";
import { generateExternalId } from "../utils/genrateExternalId.js";


export async function scrapeISRO() {
  const baseUrl = "https://www.isro.gov.in/ViewAllOpportunities.html";
  const { data } = await axios.get(baseUrl);
  const $ = cheerio.load(data);
  const site = await Site.findOne({ name: "ISRO" });
  if (!site) return console.error("ISRO site not found");

 
  $("tbody.list tr").each(async (_, el) => {
    const row = $(el);

    const location = row.find("td.location").text().trim();
    const title = row.find("td.post").text().trim();

    const button = row.find("td.moreDetails button");
    let link = button.attr("onclick") || "";
    link = link.match(/'(.+?)'/)?.[1] || baseUrl;
    link = new URL(link, baseUrl).href;

    const advNo = row.find("td.advNo").text().trim() || generateExternalId(title, link);
    const openDateText = row.find("td.openDate").text().trim();
    const endDateText = row.find("td.closeDate").text().trim();

    const openDate = openDateText ? new Date(openDateText) : null;
    const endDate = endDateText ? new Date(endDateText) : null;

  


    await saveNotice({
      title,
      link,
      location,
      externalId: advNo,
      openDate,
      endDate,
    }, site._id);
  });
  console.log("✅ ISRO scraping completed");
}
