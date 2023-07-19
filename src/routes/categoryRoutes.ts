import { Router } from "express";
import Category from "../models/Category";
import { getCategories } from "../controllers/categoryController";

const router = Router();
router.get("/", getCategories);

export default router;
