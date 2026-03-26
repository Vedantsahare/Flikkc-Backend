import { CURRENT_LEGAL_VERSION } from "../config/legal.js";

const legalGuard = (req, res, next) => {
  const user = req.user;

  // No user (should never happen after auth, but safe)
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Never accepted legal terms
  if (!user.legalAcceptedAt) {
    return res.status(403).json({
      code: "LEGAL_NOT_ACCEPTED",
      message: "You must accept the Terms & Policies to continue"
    });
  }

  // Legal version mismatch (terms updated)
  if (user.legalVersion !== CURRENT_LEGAL_VERSION) {
    return res.status(403).json({
      code: "LEGAL_VERSION_MISMATCH",
      message: "Please review and accept the updated Terms & Policies"
    });
  }

  next();
};

export default legalGuard;
