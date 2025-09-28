import {scrapeISRO} from './isroScraper.js'

export async function scrapeAll(){
   const isroJobs = await scrapeISRO();
   return [...isroJobs];
}



