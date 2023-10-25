import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/User";

const UserSchema = new Schema(
  {
    email: { type: "string", required: true, unique: true },
    firstName: { type: "string" },
    lastName: { type: "string" },
    password: { type: "string" },
    role: { type: "string", required: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> = model<IUser>("User", UserSchema);
