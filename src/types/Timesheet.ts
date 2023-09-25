import { ICategory } from "./Category";

export interface ITimesheet extends Document {
  timesheetDate: Date;
  startTime: Date | string;
  endTime: Date | string;
  category: ICategory;
  subCategory: string;
  comments: string;
  isProductive: boolean;
}
