import express from "express";
import { requestWithdrawal } from "../controllers/withdrawalController.js";
import auth from "../middlewares/auth.js";
import { userAccessGuard } from "../middlewares/userAccessGuard.js";
import { withdrawalGuard } from "../middlewares/withdrawalGuard.js";
import { kycGuard } from "../middlewares/kycGuard.js";
import { walletGuard } from "../middlewares/walletGuard.js";
import { systemGuard } from "../middlewares/systemGuard.js";

const router = express.Router();

router.post(
  "/request",
  auth,
  userAccessGuard,
  withdrawalGuard,
  kycGuard,
  walletGuard,
  requestWithdrawal
);

router.post(
  "/withdraw",
  auth,
  systemGuard,
  requestWithdrawal
);

export default router;