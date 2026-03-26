import { Worker } from "bullmq";
import { connection } from "./queue.js";
import { processPayouts } from "../workers/payoutWorker.js";
import { decayFraudScores } from "./fraudDecayJob.js";

const worker = new Worker(
  "flikkc-jobs",
  async (job) => {
    try {
      switch (job.name) {

        case "fraud-decay":
          await decayFraudScores();
          break;

        case "payout-processing":
          console.log("Running payout processing...");
          await processPayouts();
          break;

        default:
          console.warn("Unknown job:", job.name);
      }

    } catch (error) {
      console.error("Job failed:", error.message);
      throw error;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.name}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed: ${job?.name}`, err.message);
});