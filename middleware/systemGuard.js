import SystemSettings from "../models/SystemSettings.js";

export const systemGuard = async (req, res, next) => {

  const settings = await SystemSettings.findOne();

  if (!settings) return next();

  if (settings.withdrawalsPaused && originalUrl.includes("/withdraw")) {
    return res.status(503).json({
      message: "Withdrawals temporarily paused"
    });
  }

  if (settings.walletPaused && req.path.includes("wallet")) {
    return res.status(503).json({
      message: "Wallet operations temporarily paused"
    });
  }

  next();
};