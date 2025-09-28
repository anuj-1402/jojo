import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeISRO(){
const url = 'https://www.isro.gov.in/Careers.html';
const {data} = await axios.get(url);
const $ = cheerio.load(data);
const jobs = [];

$("table.content-table tbody.list tr").each((_, row) => {
    const linkTag = $(row).find('td.news a');
    const Link = linkTag.attr('href')
        ? new URL(linkTag.attr('href'), url).href
        : url;
    const Title = linkTag.attr('title');

        jobs.push({
            Title,
            Link,
            jobType: "Government",
            organisation: "ISRO",
        });
});
return jobs;
}
