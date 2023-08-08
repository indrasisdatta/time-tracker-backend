import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { ITimesheet, Timesheet } from "../models/Timesheet";
import mongoose, { ClientSession } from "mongoose";
import { API_STATUS } from "../config/constants";
import moment from "moment-timezone";
// import { convertDatetoLocalTZ } from "../utils/helpers";
// import * as moment from "moment-timezone";

export const saveTimesheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    return res
      .status(200)
      .json({ status: API_STATUS.SUCCESS, data: timesheet });
  } catch (error) {
    await session.abortTransaction();
    logger.info("Error: ", error);
    return res.status(500).json({ status: API_STATUS.SUCCESS, error: error });
  } finally {
    session.endSession();
  }
};

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
        "category subCategory comments timesheetDate startTime endTime startTimeLocal endTimeLocal"
      )
      .populate("category", "name description")
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
            //$lt: moment(startDate).add(30, "hours"),
            // $lt: moment.utc(endDate).add(1, "days").toDate(),
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
          categoryData: { $first: "$categoryData.name" },
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
