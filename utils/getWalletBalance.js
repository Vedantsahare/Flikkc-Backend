import redis from "./redisClient.js";
import Wallet from "../models/Wallet.js";

export default async function getWalletBalance(walletId) {
  const cacheKey = `wallet:${walletId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return Number(cached);

  const wallet = await Wallet.findById(walletId);

  const balance = wallet?.balance || 0;

  await redis.setex(cacheKey, 60, balance);

  return balance;
}