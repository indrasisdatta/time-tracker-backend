import { Model, Schema, model } from "mongoose";
import { IResetPwdToken } from "../types/ResetPwdToken";

const ResetPwdTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: Number(process.env.RESET_PWD_EXPIRY_SECS ?? 3600) * 1000,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const ResetPwdToken: Model<IResetPwdToken> = model<IResetPwdToken>(
  "ResetPwdToken",
  ResetPwdTokenSchema
);
