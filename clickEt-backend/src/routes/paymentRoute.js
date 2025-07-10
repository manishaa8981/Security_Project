// src/routes/paymentRoutes.js
import express from "express";
import khaltiController from "../controller/khaltiController.js";
import { protectRoute } from "../middleware/auth/routeProtection.js";

const router = express.Router();

// Khalti payment routes
router.post(
  "/khalti/initiate",
  protectRoute(["USER"]),
  khaltiController.initiatePayment
);
router.post(
  "/khalti/verify",
  protectRoute(["USER"]),
  khaltiController.verifyPayment
);
router.get(
  "/khalti/status/:pidx",
  protectRoute(["USER"]),
  khaltiController.getPaymentStatus
);
router.get(
  "/getAll",
   protectRoute(["ADMIN"]),
  khaltiController.getAllPayments
);

export default router;
