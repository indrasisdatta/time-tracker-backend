import { Router } from "express";
import {
  signupSave,
  signinUser,
  getUserProfile,
  regenerateTokens,
  forgotPwdAction,
  resetPasswordTokenCheck,
  resetPasswordSave,
  changePasswordSave,
  editProfileSave,
} from "../controllers/userController";

import { validationMiddleware } from "../validators/validationMiddleware";
// import passport from "../passport";
import { Auth } from "../middlewares/Auth";
import { multerConfig } from "../config/multerConfig";
import { UserResponse } from "../middlewares/UserResponse";

const router = Router();

router.get("/regenerate-token", Auth, regenerateTokens);
router.post("/signup", validationMiddleware("user_signup"), signupSave);
router.post("/login", signinUser);
router.post(
  "/forgot-password",
  validationMiddleware("forgot_pwd"),
  forgotPwdAction
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
  changePasswordSave,
  UserResponse
);
router.get("/profile", Auth, getUserProfile, UserResponse);
router.post(
  "/edit-profile",
  Auth, // For user authentication
  multerConfig.single("profileImage"), // Middleware for file upload
  validationMiddleware("edit_profile"), // Input validation using Joi
  editProfileSave,
  UserResponse // After middleware to format user response
);
router.get("/reset-password/:resetToken", resetPasswordTokenCheck);

export default router;
