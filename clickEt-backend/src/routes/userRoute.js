// src/routes/userRoute.js
import express from "express";
import multer from "multer";
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
import { verifyAccessToken } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  authValidationRules,
  forgetValidationRules,
  registrationValidationRules,
  resetValidationRules,
} from "../middleware/validation/authValidation.js";
import { resetLimiter } from "../utils/emailUtils.js";
import { commonlyUsedValidationResult } from "../utils/prettyValidationResult.js";
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
// router.delete("/delete/:user_name", deleteUser);
router.delete(
  "/delete/:user_name",
  verifyAccessToken,
  checkRole(["ADMIN"]),
  deleteUser
);
export default router;
