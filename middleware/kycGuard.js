export const kycGuard = (req, res, next) => {
  const user = req.user;

  if (user.kycStatus !== "verified") {
    return res.status(403).json({
      message: "KYC verification required to withdraw funds"
    });
  }

  next();
};
