import cron from "node-cron";
import { jobQueue } from "./queue.js";

/* =========================
   FRAUD DECAY (Daily 3 AM)
========================= */

cron.schedule("0 3 * * *", async () => {
  console.log("Running fraud decay scheduler...");
  await jobQueue.add("fraud-decay", {});
});

/* =========================
   PAYOUT PROCESSING (Every 2 min)
========================= */

cron.schedule("*/2 * * * *", async () => {
  console.log("Running payout scheduler...");
  await jobQueue.add("payout-processing", {});
});