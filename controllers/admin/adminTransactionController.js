import WalletLedger from "../../models/WalletLedger.js";

/* =========================
   Get all transactions
========================= */

export const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const total = await WalletLedger.countDocuments();

    const transactions = await WalletLedger.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      transactions
    });

  } catch (error) {
    console.error("Transaction fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch transactions"
    });
  }
};