import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";
import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();

router.get("/", getCategories);
router.post("/", validationMiddleware("category"), addCategory);
router.get("/:catId", getCategory);
router.put("/:catId", validationMiddleware("category"), updateCategory);
router.delete("/:catId", deleteCategory);

export default router;
