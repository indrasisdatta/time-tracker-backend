import { ObjectId } from "mongoose";

export interface ISubCategory extends Document {
  id?: string;
  _id?: string | ObjectId;
  name: string;
  isProductive?: boolean;
  description?: string;
}

export interface ICategory extends Document {
  _id?: string;
  name: string;
  description?: string;
  subCategories?: ISubCategory[];
}
