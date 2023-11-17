import { Router } from "express";
import {
  signupSave,
  signinUser,
  getUserProfile,
  forgotPwdAction,
  resetPasswordTokenCheck,
  resetPasswordSave,
  changePasswordSave,
  editProfileSave,
} from "../controllers/userController";

import { validationMiddleware } from "../validators/validationMiddleware";
import passport from "../passport";
import { Auth } from "../middlewares/Auth";
import { multerConfig } from "../config/multerConfig";

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
router.post(
  "/change-password",
  Auth,
  validationMiddleware("change_pwd"),
  changePasswordSave
);
router.post(
  "/edit-profile",
  Auth, // For user authentication
  multerConfig.single("profileImage"), // Middleware for file upload
  validationMiddleware("edit_profile"), // Input validation using Joi
  editProfileSave
);
router.get("/reset-password/:resetToken", resetPasswordTokenCheck);

export default router;
