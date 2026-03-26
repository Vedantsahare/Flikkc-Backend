import Wallet from "../models/Wallet.js";

export const walletGuard = async (req, res, next) => {
  const wallet = await Wallet.findOne({ userId: req.user.id });

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  if (wallet.isLocked) {
    return res.status(403).json({
      message: "Wallet is temporarily locked"
    });
  }

  req.wallet = wallet;
  next();
};
