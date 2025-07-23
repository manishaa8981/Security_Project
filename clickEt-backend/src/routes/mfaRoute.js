import express from "express";
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { setupTOTP, verifyTOTP } from "../controller/mfaController.js";

const router = express.Router();

router.get("/totp/setup", verifyAccessToken, setupTOTP);
router.post("/totp/verify", verifyAccessToken, verifyTOTP);

export default router;
