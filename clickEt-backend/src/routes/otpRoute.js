import express from "express";
import { sendOTP, verifyOTP } from "../controller/otpController.js";

const router = express.Router();

router.post("/send", sendOTP);
router.post("/verify", verifyOTP);

export default router;
