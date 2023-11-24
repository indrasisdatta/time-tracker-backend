export interface IUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "admin" | "end_user";
}
