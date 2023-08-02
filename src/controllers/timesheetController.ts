import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { Timesheet } from "../models/Timesheet";
import mongoose, { ClientSession } from "mongoose";
import { API_STATUS } from "../config/constants";

export const saveTimesheet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const { timesheetDate, timeslots } = req.body;

    // if (cat) {
    return res
      .status(200)
      .json({ status: API_STATUS.SUCCESS, data: timeslots });
    // }
    // res.status(500).json({ status: API_STATUS.ERROR, data: [] });

    // timeslots.map(slot => {

    // })
    const timeslot = new Timesheet({
      startTime: new Date("2023-08-03 09:30"),
      endTime: new Date("2023-08-03 10:00"),
      category: "64b8af518d5261063b805d4c",
      subCategory: "Official",
      comments: "Postman insert",
    });
    const timesheet = await timeslot.save();
    logger.info("Timesheet saved", timesheet);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    logger.info("Error: ", error);
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
    const records = await Timesheet.find({}).populate(
      "category",
      "name description"
    );

    console.log("Timesheet records", records);
  } catch (error) {
    logger.info("Daily records error: ", error);
  }
};
