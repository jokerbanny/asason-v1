import { Router } from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router
  .route("/")
  .get(protect, authorize("ADMIN"), getUsers)
  .post(protect, authorize("ADMIN"), createUser);

router
  .route("/:id")
  .get(protect, authorize("ADMIN"), getUser)
  .put(protect, authorize("ADMIN"), updateUser)
  .delete(protect, authorize("ADMIN"), deleteUser);

export default router;
