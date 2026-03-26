import rateLimit from "express-rate-limit";

/* Global API limiter */

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

/* Profile limiter */

export const profileLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5
});

/* Wallet limiter */

export const walletLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3
});

/* IP limiter */

export const ipLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100
});

/* User limiter */

export const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  keyGenerator: (req) => req.user?.id || req.ip
});