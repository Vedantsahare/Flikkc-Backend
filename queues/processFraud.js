import { Worker } from "bullmq";
import redis from "../utils/redisClient.js";

const worker = new Worker(
  "flikkc-jobs",
  async (job) => {

    switch (job.name) {

      case "fraud-check":
        console.log("Running fraud check");
        break;

      default:
        console.log("Unknown job:", job.name);

    }

  },
  { connection: redis }
);

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});