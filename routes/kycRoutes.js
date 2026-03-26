import express from "express";
import auth from "../middleware/auth.js";
import {
sendPhoneOtp,
verifyPhoneOtp,
submitPan,
submitAadhaar,
enableWithdrawal
} from "../controllers/kycController.js";

const router = express.Router();

router.post("/send-phone-otp", auth, sendPhoneOtp);
router.post("/verify-phone-otp", auth, verifyPhoneOtp);
router.post("/pan", auth, submitPan);
router.post("/aadhaar", auth, submitAadhaar);
router.post("/enable-withdrawal", auth, enableWithdrawal);

export default router;