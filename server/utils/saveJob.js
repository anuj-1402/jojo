import noticesModel from '../models/noticesModel.js';
import {scrapeISRO} from '../scrapers/isroScraper.js'


export async function saveJob(){
   const isroJobs = await scrapeISRO();
   const allJob =  [...isroJobs];

   for(const job of allJob){
      const existingJob = await noticesModel.findOne({title: job.Title, link: job.Link});
      if(!existingJob){
         const newJob = new noticesModel({
            title: job.Title,
            link: job.Link,
            externalId: job.advno,
            openDate: job.openDate,
            endDate: job.closeDate,
            location: job.location
           
         });
         await newJob.save();
         console.log(`Saved new job: ${job.Title}`);
      } else {
         console.log(`Job already exists: ${job.Title}`);
      }



   }





}



