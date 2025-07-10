// src/routes/distributorsRoute.js
import express from "express";
import { validationRules } from "../middleware/validation/distributorsValidation.js";
import { commonlyUsedValidationResult } from "../utils/prettyValidationResult.js";
import {
  addDistributor,
  checkUniqueDistributors,
  deleteDistributor,
  getAllDistributors,
  getDistributorByName,
  getDistributorsByMovieId,
  getDistributorsbyStatus,
  updateDistributor,
  uploadDistributorLogo,
} from "../controller/distributorsController.js";
import { protectRoute } from "../middleware/auth/routeProtection.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/add",
  protectRoute(["ADMIN"]),
  validationRules,
  commonlyUsedValidationResult,
  addDistributor
);

router.get(
  "/getAll",
  protectRoute(["ADMIN"]),

  getAllDistributors
);
router.get(
  "/",
  protectRoute(["ADMIN"]),

  getDistributorByName
);
router.get(
  "/getByStatus/:isActive",
  protectRoute(["ADMIN"]),

  getDistributorsbyStatus
);
router.get("/getByMovie/:movieId", getDistributorsByMovieId);

router.put(
  "/update/:id",
  validationRules,
  commonlyUsedValidationResult,
  protectRoute(["ADMIN"]),
  updateDistributor
);
router.patch(
  "/upload",
  protectRoute(["ADMIN"]),
  upload.single("image"),
  uploadDistributorLogo
);

router.delete("/delete/:id", protectRoute(["ADMIN"]), deleteDistributor);

router.post(
  "/checkUnique",
  protectRoute(["ADMIN"]),

  checkUniqueDistributors
);
export default router;
