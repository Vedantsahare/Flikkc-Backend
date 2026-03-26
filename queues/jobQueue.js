import { Queue } from "bullmq";
import redis from "../utils/redisClient.js";

export const jobQueue = new Queue(
  "flikkc-jobs",
  {
    connection: redis
  }
);