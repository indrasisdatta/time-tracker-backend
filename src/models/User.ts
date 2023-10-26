import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";
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

UserSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash((user as IUser).password, 10);
  next();
});

UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, (user as IUser).password);
  return compare;
};

export const User: Model<IUser> = model<IUser>("User", UserSchema);
