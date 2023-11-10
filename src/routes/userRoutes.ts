import { Router } from "express";
import {
  signupSave,
  signinUser,
  getUserProfile,
  forgotPwdAction,
  resetPasswordTokenCheck,
  resetPasswordSave,
} from "../controllers/userController";

import { validationMiddleware } from "../validators/validationMiddleware";
import passport from "../passport";
import { Auth } from "../middlewares/Auth";

const router = Router();

router.post("/signup", validationMiddleware("user_signup"), signupSave);
router.post("/login", signinUser);
router.post(
  "/forgot-password",
  validationMiddleware("forgot_pwd"),
  forgotPwdAction
);
router.get(
  "/profile",
  // passport.authenticate("jwt", { session: false }),
  Auth,
  getUserProfile
);
router.post(
  "/reset-password",
  validationMiddleware("reset_pwd"),
  resetPasswordSave
);

router.get("/reset-password/:resetToken", resetPasswordTokenCheck);

export default router;
