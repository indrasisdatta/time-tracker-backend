import { Document, Model, Schema, model } from "mongoose";
import { ICategory, ISubCategory } from "../types/Category";

// export interface iCategoryRequest extends ICategory, Document {
//   isCategoryNameUnique(name: string): Promise<boolean>;
// }

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    subCategories: [
      new Schema<ISubCategory>({
        _id: { type: Schema.ObjectId },
        name: { type: String, required: true, unique: true },
        isProductive: { type: Boolean },
        description: { type: String },
      }),
    ],
  },
  { timestamps: true }
);

categorySchema.static(
  "isCategoryNameUnique",
  async function (name: string): Promise<boolean> {
    const existingCategory: ICategory = await this.findOne({ name });
    return !existingCategory;
  }
);

export const Category: Model<ICategory> = model<ICategory>(
  "Category",
  categorySchema
);

// export default Category;
