export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "admin" | "end_user";
}
