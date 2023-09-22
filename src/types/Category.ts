export interface ISubCategory extends Document {
  _id?: string;
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
