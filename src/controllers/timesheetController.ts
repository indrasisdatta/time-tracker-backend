import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { Timesheet } from "../models/Timesheet";

import mongoose, { ClientSession } from "mongoose";
import { API_STATUS } from "../config/constants";
import moment from "moment-timezone";
import { ITimesheet } from "../types/Timesheet";
// import { convertDatetoLocalTZ } from "../utils/helpers";
// import * as moment from "moment-timezone";

/* Add/update timesheet entry based on date */
export const saveTimesheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let apiStatus: number = 500;
  let apiResponse;
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const { timesheetDate, timeslots } = req.body;

    if (!timeslots || timeslots.length == 0) {
      return res
        .status(400)
        .json({ status: API_STATUS.ERROR, error: ["No timesheet entered"] });
    }

    /* 1. Delete previous entries for timesheetDate */
    const delTimesheet = await Timesheet.deleteMany({
      timesheetDate: {
        $gte: moment.utc(timesheetDate).toDate(),
        $lt: moment.utc(timesheetDate).add(1, "days").toDate(),
      },
    });
    logger.info(`Delete existing recs for ${timesheetDate} date`, delTimesheet);

    /* 2. Insert data */
    const timesheetArr = timeslots.map((slot: ITimesheet) => {
      slot.timesheetDate = new Date(timesheetDate);
      slot.startTime = new Date(`${timesheetDate} ${slot.startTime}`);
      slot.endTime = new Date(`${timesheetDate} ${slot.endTime}`);
      // slot.startTime = convertDatetoLocalTZ(
      //   new Date(`${timesheetDate} ${slot.startTime}`).getTime()
      // );
      // slot.endTime = convertDatetoLocalTZ(
      //   new Date(`${timesheetDate} ${slot.endTime}`).getTime()
      // );
      return slot;
    });
    const timesheet = await Timesheet.insertMany(timeslots);
    logger.info("Timesheet saved", timesheet);
    await session.commitTransaction();
    apiStatus = 200;
    apiResponse = { status: API_STATUS.SUCCESS, data: timesheet };
  } catch (error) {
    await session.abortTransaction();
    logger.info("Error: ", error);
    apiStatus = 500;
    apiResponse = { status: API_STATUS.ERROR, error };
  } finally {
    session.endSession();
    return res.status(apiStatus).json(apiResponse);
  }
};

/* Fetch timesheet entries for a specific date */
export const getDailyRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.params;
    if (!date) {
      return res
        .status(400)
        .json({ status: API_STATUS.ERROR, data: [], error: "Date is missing" });
    }
    const records = await Timesheet.find({
      timesheetDate: {
        $gte: new Date(date),
        $lt: moment.utc(date).add(1, "days").toDate(),
      },
    })
      .select(
        "category subCategory comments timesheetDate startTime endTime startTimeLocal endTimeLocal isProductive"
      )
      .populate("category", "name description subCategories")
      .exec();

    if (records) {
      return res
        .status(200)
        .json({ status: API_STATUS.SUCCESS, data: records });
    }
    return res.status(500).json({ status: API_STATUS.SUCCESS, data: [] });
  } catch (error) {
    logger.info("Daily records error: ", error);
    return res.status(500).json({ status: API_STATUS.ERROR, data: [], error });
  }
};

/* Generate timesheet summary i.e time spent in each category */
export const getTimesheetSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.body;

    const timesheetSummary = await Timesheet.aggregate([
      {
        $match: {
          timesheetDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $group: {
          _id: "$subCategory",
          categoryData: { $first: "$categoryData" },
          subCategory: { $first: "$subCategory" },
          totalTime: {
            $sum: {
              $dateDiff: {
                startDate: "$startTime",
                endDate: "$endTime",
                unit: "minute",
              },
            },
          },
        },
      },
      { $unwind: "$categoryData" },
      {
        $sort: { totalTime: -1 },
      },
    ]);

    if (timesheetSummary) {
      return res
        .status(200)
        .json({ status: API_STATUS.SUCCESS, data: timesheetSummary });
    }
    return res.status(500).json({ status: API_STATUS.SUCCESS, data: [] });
  } catch (error) {
    logger.info("Summary error: ", error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      data: [],
      error,
    });
  }
};

/* Calculate total productive time spend on each day (between a date range) */
export const timesheetCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.body;
    const calendarData = await Timesheet.aggregate([
      /* Match stage */
      {
        $match: {
          timesheetDate: {
            $gte: new Date(startDate),
            $lt: new Date(endDate),
          },
          isProductive: true,
        },
      },
      /* Group stage */
      {
        $group: {
          _id: "$timesheetDate",
          totalTimeMins: {
            $sum: {
              $dateDiff: {
                startDate: "$startTime",
                endDate: "$endTime",
                unit: "minute",
              },
            },
          },
        },
      },
      /* Project stage */
      {
        $project: {
          timesheetDate: "$_id",
          totalTimeMins: 1,
          _id: 0,
        },
      },
      /* Sort in asc */
      {
        $sort: { timesheetDate: 1 },
      },
    ]);

    if (calendarData) {
      return res
        .status(200)
        .json({ status: API_STATUS.SUCCESS, data: calendarData });
    }
    return res.status(500).json({ status: API_STATUS.SUCCESS, data: [] });
  } catch (error) {
    logger.error("Calendar error: ", error);
    return res.status(500).json({
      status: API_STATUS.ERROR,
      data: [],
      error,
    });
  }
};
