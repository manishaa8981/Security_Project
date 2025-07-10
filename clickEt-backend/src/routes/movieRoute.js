// src/routes/movieRoute.js
import express from "express";
import { validationRules } from "../middleware/validation/movieValidation.js";
import { checkAndFormatDate } from "../middleware/utils/dateFormatter.js";
import { commonlyUsedValidationResult } from "../utils/prettyValidationResult.js";
import {
  addMovie,
  deleteMovie,
  updateMovie,
  checkUniqueMovies,
  getAllMovies,
  getMovieById,
  getMoviesByStatus,
  getMovieBySlug,
  toggleMovieStatus,
} from "../controller/moviesController.js";
import { protectRoute } from "../middleware/auth/routeProtection.js";

const router = express.Router();

router.post("/add", validationRules, commonlyUsedValidationResult, addMovie);

router.get("/getAll", getAllMovies);
router.get("/:slug", getMovieBySlug);
router.post("/getById/:movieId", getMovieById);
router.patch("/toggle/:movie_id", protectRoute(["ADMIN"]), toggleMovieStatus);
router.get("/status/:status", getMoviesByStatus);

router.put(
  "/update/:id",
  checkAndFormatDate,
  validationRules,
  commonlyUsedValidationResult,
  protectRoute(["ADMIN"]),
  updateMovie
);

router.delete("/delete/:id", protectRoute("ADMIN"), deleteMovie);

router.post("/checkUnique", checkUniqueMovies);
export default router;
