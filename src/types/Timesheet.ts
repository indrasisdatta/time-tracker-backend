import { ICategory } from "./Category";

export interface ITimesheet extends Document {
  timesheetDate: Date;
  startTime: Date;
  endTime: Date;
  category: ICategory;
  subCategory: string;
  comments: string;
  isProductive: boolean;
}
