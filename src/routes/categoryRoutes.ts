import { Router } from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController";
import {
  validateAddCategory,
  validationMiddleware,
} from "../validators/validationMiddleware";

const router = Router();

router.get("/", getCategories);
// router.post("/", validateAddCategory, addCategory);

router.post("/", validationMiddleware("addCategory"), addCategory);

router.put("/:catId", updateCategory);

export default router;
