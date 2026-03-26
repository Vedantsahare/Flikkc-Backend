import Wallet from "../models/Wallet.js";

export const autoLockWallet = async (
  userId,
  reason
) => {

  await Wallet.updateOne(
    { userId },
    {
      $set: {
        isLocked: true,
        lockedReason: reason,
        lockedAt: new Date()
      }
    }
  );

};