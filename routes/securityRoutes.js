import express from "express";
import auth from "../middlewares/auth.js";
import {
  checkBot,
  checkWalletFraud
} from "../controllers/securityController.js";

const router = express.Router();

router.post("/bot-check", auth, checkBot);
router.post("/wallet-check", auth, checkWalletFraud);

export default router;