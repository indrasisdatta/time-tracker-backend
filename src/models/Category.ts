import { Document, Schema, model } from "mongoose";

interface ISubCategory extends Document {
  name: string;
  description?: string;
}

interface ICategory extends Document {
  name: string;
  description?: string;
  subCategories?: ISubCategory[];
}

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    subCategories: [
      new Schema<ISubCategory>({
        name: { type: String, required: true, unique: true },
        description: { type: String },
      }),
    ],
  },
  { timestamps: true }
);

export default model<ICategory>("Category", categorySchema);
