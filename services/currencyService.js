import axios from "axios";
import redis from "../utils/redisClient.js";

const API_URL = "https://open.er-api.com/v6/latest";

export const convertCurrency = async (amount, from, to) => {

  if (from === to) return amount;

  const cacheKey = `rate:${from}:${to}`;
  const cached = await redis.get(cacheKey);

  if (cached) return amount * Number(cached);

  const response = await axios.get(`${API_URL}/${from}`);
  const rate = response.data.rates[to];

  if (!rate) throw new Error("Currency not supported");

  await redis.setex(cacheKey, 3600, rate);

  return amount * rate;
};