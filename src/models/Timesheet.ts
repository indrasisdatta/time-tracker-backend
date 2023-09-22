import { Model, Schema, model } from "mongoose";
import { convertDatetoLocalTZ } from "../utils/helpers";
import moment from "moment-timezone";
import { ITimesheet } from "../types/Timesheet";
// import * as timezonePlugin from "mongoose-timezone";

const timesheetSchema = new Schema(
  {
    timesheetDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: () => convertDatetoLocalTZ(),
    },
    endTime: {
      type: Date,
      required: true,
      default: () => convertDatetoLocalTZ(),
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: String, required: true },
    comments: { type: String },
    isProductive: { type: Boolean },
  },
  {
    virtuals: {
      startTimeLocal: {
        get() {
          return moment(this.startTime).tz(process.env.TIME_ZONE!).format();
        },
      },
      endTimeLocal: {
        get() {
          return moment(this.endTime).tz(process.env.TIME_ZONE!).format();
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// timesheetSchema.virtual("startTimeLocal").get(function () {
//   return moment(this.startTime).tz("Asia/Kolkata").format();
// });

// timesheetSchema.plugin(timezonePlugin);

// timesheetSchema.post("find", function (documents, next) {
//   if (documents && documents.length > 0) {
//     documents.map((doc: any) => {
//       doc.startTime = moment(doc.startTime).tz("Asia/Kolkata").toDate();
//       doc.endTime = moment(doc.endTime).tz("Asia/Kolkata").toDate();
//     });
//   }
//   next();
// });

export const Timesheet: Model<ITimesheet> = model<ITimesheet>(
  "Timesheet",
  timesheetSchema
);
