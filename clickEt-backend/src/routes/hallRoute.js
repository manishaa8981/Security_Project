// routes/hallRoutes.js
import express from "express";
import {
  createHall,
  getAllHalls,
  getHallById,
  updateHall,
  deleteHall,
  toggleHallStatus,
  getHallsByTheatre,
} from "../controller/hallController.js";

import { protectRoute } from "../middleware/auth/routeProtection.js";

const router = express.Router();

router.post("/add", protectRoute(["ADMIN"]), createHall);
router.get("/getAll", getAllHalls);
router.get("/theatre/:theatreId", getHallsByTheatre);
router.get("/:id", protectRoute(["ADMIN"]), getHallById);
router.patch("/update/:id", protectRoute(["ADMIN"]), updateHall);
router.patch("/toggle/:id", protectRoute(["ADMIN"]), toggleHallStatus);
router.delete("/delete/:id", protectRoute(["ADMIN"]), deleteHall);

export default router;
