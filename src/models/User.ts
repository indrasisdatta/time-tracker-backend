import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";

interface UserModel extends Model<IUser> {
  isExistingEmail(email: string): Promise<IUser | null>;
}

interface UserMethods {
  isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser, UserModel, UserMethods>(
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
  this.password = hash;
  next();
});

UserSchema.statics.isExistingEmail = async function (email: string) {
  return await this.findOne({ email });
};

UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

export const User = model<IUser, UserModel>("User", UserSchema);
