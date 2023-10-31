import { Router } from "express";
import {
  signupSave,
  signinUser,
  getUserProfile,
} from "../controllers/userController";

import { validationMiddleware } from "../validators/validationMiddleware";
import passport from "../passport";
import { Auth } from "../middlewares/Auth";

const router = Router();

router.post("/signup", validationMiddleware("user_signup"), signupSave);
router.post("/login", signinUser);
router.get(
  "/profile",
  // passport.authenticate("jwt", { session: false }),
  Auth,
  getUserProfile
);

export default router;
