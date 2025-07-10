// src/routes/userRoute.js
import express from "express";
import {
  authValidationRules,
  registrationValidationRules,
  forgetValidationRules,
  resetValidationRules,
} from "../middleware/validation/authValidation.js";
import { commonlyUsedValidationResult } from "../utils/prettyValidationResult.js";
import {
  checkExistingAuthCredentials,
  deleteUser,
  initAuthStatus,
  initAuthentication,
  initLogOut,
  initRegistration,
  initTokenRefresh,
  resetPassword,
  sendResetEmail,
  uploadProfileImage,
} from "../controller/authController.js";
import { protectRoute } from "../middleware/auth/routeProtection.js";
import { resetLimiter } from "../utils/emailUtils.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/register",
  registrationValidationRules,
  commonlyUsedValidationResult,
  initRegistration
);

router.post(
  "/login",
  authValidationRules,
  commonlyUsedValidationResult,
  initAuthentication
);
router.post(
  "/forget-password",
  resetLimiter,
  forgetValidationRules,
  commonlyUsedValidationResult,
  sendResetEmail
);
router.post(
  "/reset-password",
  resetValidationRules,
  commonlyUsedValidationResult,
  resetPassword
);

router.post("/checkUnique", checkExistingAuthCredentials);
router.post("/checkUnique", checkExistingAuthCredentials);

router.post("/refresh", protectRoute(), initTokenRefresh);
router.get("/user/status", initAuthStatus);
router.patch(
  "/user/upload",
  protectRoute(),
  upload.single("image"),
  uploadProfileImage
);
router.post("/logout", protectRoute(), initLogOut);
router.delete("/delete/:user_name", deleteUser);

export default router;
