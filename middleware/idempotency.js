import redis from "../utils/redisClient.js";

export const idempotency = async (req, res, next) => {

  const key = req.headers["idempotency-key"];

  if (!key) return next();

  const exists = await redis.get(`idem:${key}`);

  if (exists) {
    return res.status(409).json({
      message: "Duplicate request"
    });
  }

  await redis.set(`idem:${key}`, "1", "EX", 300, "NX");

  next();

};