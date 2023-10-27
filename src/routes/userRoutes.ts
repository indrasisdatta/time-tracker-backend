import { Router } from "express";
import { signupSave, signinUser } from "../controllers/userController";

import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();

router.post("/signup", validationMiddleware("user_signup"), signupSave);
router.post("/login", signinUser);

export default router;
