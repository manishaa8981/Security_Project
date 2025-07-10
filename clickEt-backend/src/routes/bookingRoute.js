// src/routes/bookingRoute.js
import express from "express";
import { bookingController } from "../controller/bookingController.js";
import { protectRoute } from "../middleware/auth/routeProtection.js";

const router = express.Router();

router.post("/hold", protectRoute(["USER"]), bookingController.holdSeats);

router.post(
  "/confirm",
  protectRoute(["USER"]),
  bookingController.confirmBooking
);
router.post(
  "/download",
  protectRoute(["USER"]),
  bookingController.downloadTicket
);

router.get(
  "/getAll",
  protectRoute(["ADMIN"]),
  bookingController.getAllBookings
);
router.get(
  "/holds/getAll",
  protectRoute(["USER"]),
  bookingController.getActiveHolds
);
router.delete(
  "/hold/release/:holdId",
  protectRoute(["USER"]),
  bookingController.releaseHold
);
router.get(
  "/history",
  protectRoute(["USER"]),
  bookingController.getBookingHistory
);

router.delete(
  "/delete/:id",
  protectRoute(["ADMIN"]),
  bookingController.deleteBookingById
);

export default router;
