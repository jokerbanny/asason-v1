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
  .get(getUsers)
  // .get(protect, authorize("ADMIN"), getUsers)
  .post(createUser);
// .post(protect, authorize("ADMIN"), createUser);

router
  .route("/:id")
  .get(getUser)
  // .get(protect, authorize("ADMIN"), getUser)
  .put(updateUser)
  // .put(protect, authorize("ADMIN"), updateUser)
  .delete(deleteUser);
// .delete(protect, authorize("ADMIN"), deleteUser);

export default router;
