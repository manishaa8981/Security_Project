// src/routes/theatreRoute.js
import express from "express";
import { validateTheatre } from "../middleware/validation/theatreValidation.js";
import { commonlyUsedValidationResult } from "../utils/prettyValidationResult.js";
import {
  addTheatre,
  getAllTheatres,
  getTheatreByName,
  getTheatresbyStatus,
  getTheatresByAddress,
  updateTheatre,
  deleteTheatre,
} from "../controller/theatreController.js";
import { protectRoute } from "../middleware/auth/routeProtection.js";
const router = express.Router();

router.post(
  "/add",
  validateTheatre,
  commonlyUsedValidationResult,
  protectRoute(["ADMIN"]),
  addTheatre
);

router.get("/getAll", getAllTheatres);
router.post("/getByName", getTheatreByName);
router.post("/getByStatus/:isActive", getTheatresbyStatus);
router.post("/getByAddress", getTheatresByAddress);

router.put(
  "/update/:id",
  validateTheatre,
  commonlyUsedValidationResult,
  protectRoute(["ADMIN"]),
  updateTheatre
);

router.delete("/delete/:id", protectRoute(["ADMIN"]), deleteTheatre);

export default router;
