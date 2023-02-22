import { Router } from "express";
import {
  userRegister,
  userLogin,
  userAccount,
  userLogout,
  userUpdateDetails,
  userUpdatePassword,
} from "../controllers/authController";
import { protect } from "./../middlewares/authMiddleware";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/account", protect, userAccount);
router.get("/logout", userLogout);

router.patch("/update-details", protect, userUpdateDetails);
router.patch("/update-password", protect, userUpdatePassword);

export default router;
