import express from "express";
import { screeningController } from "../controller/screeningController.js";
import { screeningValidation } from "../middleware/validation/screeningValidation.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/add",
  //   authMiddleware.isAdmin,
  screeningValidation.add,
  screeningController.add
);

router.put(
  "/update/:id",
  //   authMiddleware.isAdmin,
  screeningValidation.update,
  screeningController.update
);

router.delete(
  "/delete/:id",
  //   authMiddleware.isAdmin,
  screeningValidation.delete,
  screeningController.delete
);

// Public routes
router.get("/getAll", screeningValidation.getAll, screeningController.getAll);
router.get(
  "/getLayoutById/:id",
  screeningValidation.getAll,
  screeningController.getLayoutByid
);

router.get("/:id", screeningValidation.getById, screeningController.getById);
router.get("/byMovie/:movieId", screeningValidation.getById, screeningController.getByMovie);
router.get("/:id/layout", screeningController.getLayoutByid);

export default router;
