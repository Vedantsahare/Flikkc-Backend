export const withdrawalGuard = (req, res, next) => {
  const user = req.user;

  if (user.withdrawalBlocked) {
    return res
      .status(403)
      .json({ message: "Withdrawals temporarily disabled" });
  }

  next();
};
