export const userAccessGuard = (req, res, next) => {
  const user = req.user;

  if (user.accountStatus !== "ACTIVE") {
    return res
      .status(403)
      .json({ message: "Account access restricted" });
  }

  next();
};
