import redis from "../utils/redisClient.js";

export const cache = (keyPrefix, ttl = 60) => {

  return async (req, res, next) => {

    const key = `${keyPrefix}:${req.originalUrl}`;

    try {

      const cached = await redis.get(key);

      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalSend = res.json.bind(res);

      res.json = (body) => {

        redis.setex(key, ttl, JSON.stringify(body));

        return originalSend(body);

      };

      next();

    } catch (error) {

      next();

    }

  };

};