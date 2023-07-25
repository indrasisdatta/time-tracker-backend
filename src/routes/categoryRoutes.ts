import { Router } from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController";
import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();

router.get("/", getCategories);
router.post("/", validationMiddleware("category"), addCategory);
router.put("/:catId", validationMiddleware("category"), updateCategory);

export default router;
