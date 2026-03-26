import mongoose from "mongoose";
import Wallet from "./models/Wallet.js";

const checkOldBalances = async () => {
  const walletsWithBalance = await Wallet.find({
    balance: { $exists: true }
  }).select("_id userId balance");

  console.log("Wallets with old balance field:", walletsWithBalance.length);

  if (walletsWithBalance.length > 0) {
    console.log(walletsWithBalance);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await checkOldBalances();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
