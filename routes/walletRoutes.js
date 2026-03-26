import express from "express";
import auth from "../middleware/auth.js";
import { idempotency } from "../middleware/idempotency.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { processWalletTransaction } from "../services/walletservice.js";

const router = express.Router();

/* =========================
   Wallet overview
========================= */

router.get("/", auth, async (req, res) => {

  const wallet = await Wallet.findOne({
    userId: req.user.id
  });

  const transactions = await Transaction.find({
    userId: req.user.id
  })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    balance: wallet?.balance || 0,
    transactions
  });

});

/* =========================
   Add funds
========================= */

router.post("/add",
  auth,
  idempotency,
  async (req, res) => {

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    try {

      const result = await processWalletTransaction({
        userId: req.user.id,
        type: "credit",
        amount,
        description: "Funds added",
        source: "wallet"
      });

      res.json({
        balance: result.wallet.balance,
        transaction: result.transaction
      });

    } catch (err) {

      res.status(400).json({
        message: err.message
      });

    }

});

/* =========================
   Withdraw funds
========================= */

router.post("/withdraw",
  auth,
  idempotency,
  async (req, res) => {

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount"
      });
    }

    try {

      const result = await processWalletTransaction({
        userId: req.user.id,
        type: "debit",
        amount,
        description: "Funds withdrawn",
        source: "wallet"
      });

      res.json({
        balance: result.wallet.balance,
        transaction: result.transaction
      });

    } catch (err) {

      res.status(400).json({
        message: err.message
      });

    }

});

/* =========================
   Full transaction history
========================= */

router.get("/transactions",
  auth,
  async (req, res) => {

    const txns = await Transaction.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(txns);

});

export default router;