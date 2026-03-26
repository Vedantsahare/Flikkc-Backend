import express from "express";
import { requestWithdrawal } from "../controllers/withdrawalController.js";
import auth from "../middleware/auth.js";
import { userAccessGuard } from "../middleware/userAccessGuard.js";
import { withdrawalGuard } from "../middleware/withdrawalGuard.js";
import { kycGuard } from "../middleware/kycGuard.js";
import { walletGuard } from "../middleware/walletGuard.js";
import { systemGuard } from "../middleware/systemGuard.js";

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