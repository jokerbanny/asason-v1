import { Router } from "express";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteDiscount
} from "../controllers/courseController";

const router = Router();

router
    .route('/')
      .get(getCourses)
      .post(createCourse)

router
    .route('/:id')
      .get(getCourse)
      .put(updateCourse)
      .delete(deleteDiscount)

export default router;
