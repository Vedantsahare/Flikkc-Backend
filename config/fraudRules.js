export const FRAUD_RULES = [
  {
    code: "MULTI_WITHDRAW_24H",
    description: "Multiple withdrawals in 24 hours",
    weight: 20,

    evaluate: async ({ userId, Transaction }) => {
      try {
        const count = await Transaction.countDocuments({
          userId,
          type: "debit",
          createdAt: {
            $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        });

        return count >= 2;
      } catch (err) {
        return false;
      }
    }
  },

  {
    code: "FAST_WITHDRAW_AFTER_DEPOSIT",
    description: "Withdrawal within 10 minutes of deposit",
    weight: 25,

    evaluate: async ({ userId, Transaction }) => {
      try {
        const lastDeposit = await Transaction.findOne({
          userId,
          type: "credit"
        }).sort({ createdAt: -1 });

        if (!lastDeposit) return false;

        return Date.now() - lastDeposit.createdAt < 10 * 60 * 1000;
      } catch (err) {
        return false;
      }
    }
  },

  {
    code: "KYC_REJECTED_ONCE",
    description: "KYC rejected previously",
    weight: 15,

    evaluate: async ({ user }) => {
      return user?.kycStatus === "rejected";
    }
  }
];

export const FRAUD_THRESHOLD = 40;