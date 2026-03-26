import express from "express";
import auth from "../middleware/auth.js";
import { roleGuard } from "../middleware/roleGuard.js";

import { adjustWallet } from "../controllers/adminWalletController.js";
import { addAdminNote, getAdminNotes } from "../controllers/adminNotesController.js";
import { investigateUser } from "../controllers/adminFraudController.js";
import { approvePendingAction } from "../controllers/adminApprovalController.js";
import { updateSystemStatus } from "../controllers/adminSystemController.js";

const router = express.Router();

/* System control */

router.post(
  "/system/lockdown",
  auth,
  roleGuard("SUPER_ADMIN"),
  updateSystemStatus
);

/* Wallet adjustment */

router.post(
  "/wallet/adjust",
  auth,
  roleGuard("SUPER_ADMIN", "OPERATIONS_ADMIN"),
  adjustWallet
);

/* Admin notes */

router.post(
  "/users/note",
  auth,
  roleGuard("SUPER_ADMIN", "SUPPORT_ADMIN", "FRAUD_ANALYST"),
  addAdminNote
);

router.get(
  "/users/:userId/notes",
  auth,
  roleGuard("SUPER_ADMIN", "SUPPORT_ADMIN", "FRAUD_ANALYST"),
  getAdminNotes
);

/* Fraud investigation */

router.get(
  "/users/:userId/investigate",
  auth,
  roleGuard("SUPER_ADMIN", "FRAUD_ANALYST"),
  investigateUser
);

/* Pending approvals */

router.post(
  "/actions/:actionId/approve",
  auth,
  roleGuard("SUPER_ADMIN", "OPERATIONS_ADMIN"),
  approvePendingAction
);

export default router;