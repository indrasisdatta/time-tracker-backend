import { Model, Schema, model } from "mongoose";
import { IUser } from "../types/User";
import bcrypt from "bcrypt";

interface UserMethods {
  isValidPassword(password: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser, any, UserMethods, any> {
  isExistingEmail(email: string, _id?: string): Promise<IUser | null>;
}

const UserSchema = new Schema<IUser, UserModel, UserMethods>(
  {
    email: { type: "string", required: true, unique: true },
    firstName: { type: "string" },
    lastName: { type: "string" },
    password: { type: "string" },
    role: { type: "string", required: true },
    profileImage: { type: "string", required: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash((user as IUser).password, 10);
  this.password = hash;
  next();
});

UserSchema.statics.isExistingEmail = async function (
  email: string,
  id?: string
) {
  let condition: { email: string; _id?: any } = { email };
  if (id) {
    condition._id = { $ne: id };
  }
  return await this.findOne(condition);
};

UserSchema.methods.isValidPassword = async function (password: string) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

export const User = model<IUser, UserModel>("User", UserSchema);
