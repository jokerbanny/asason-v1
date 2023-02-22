import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authorize, protect } from "../middlewares/authMiddleware";

const router = Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("ADMIN"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("ADMIN"), updateCategory)
  .delete(protect, authorize("ADMIN"), deleteCategory);

export default router;
