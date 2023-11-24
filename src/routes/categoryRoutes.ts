import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controllers/categoryController";
import { validationMiddleware } from "../validators/validationMiddleware";
import { Auth } from "../middlewares/Auth";

const router = Router();

router.get("/", Auth, getCategories);
router.post("/", Auth, validationMiddleware("category"), addCategory);
router.get("/:catId", Auth, getCategory);
router.put("/:catId", Auth, validationMiddleware("category"), updateCategory);
router.delete("/:catId", Auth, deleteCategory);

export default router;
