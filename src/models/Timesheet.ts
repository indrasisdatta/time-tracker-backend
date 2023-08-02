import { Model, Schema, model } from "mongoose";
import { ICategory, ISubCategory } from "./Category";

export interface ITimesheet extends Document {
  startTime: Date;
  endTime: Date;
  category: ICategory;
  subCategory: string;
  comments: string;
}

const timesheetSchema = new Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: String, required: true },
    comments: { type: String },
  },
  { timestamps: true }
);

export const Timesheet: Model<ITimesheet> = model<ITimesheet>(
  "Timesheet",
  timesheetSchema
);
