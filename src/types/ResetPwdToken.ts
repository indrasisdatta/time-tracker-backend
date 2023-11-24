import { IUser } from "./User";

export interface IResetPwdToken {
  token: string;
  createdAt: Date;
  user: IUser;
}
