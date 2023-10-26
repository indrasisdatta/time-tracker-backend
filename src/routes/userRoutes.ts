import { Router } from "express";
import { signupSave } from "../controllers/userController";
import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();

router.post("/signup", validationMiddleware("user_signup"), signupSave);

export default router;
