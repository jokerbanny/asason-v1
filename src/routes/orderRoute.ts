import { Router } from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";

import { authorize, protect } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").get(protect, getOrders).post(protect, createOrder);

router
  .route("/:id")
  .get(getOrder)
  .put(protect, authorize("ADMIN"), updateOrder)
  .delete(protect, authorize("ADMIN"), deleteOrder);

export default router;
