import * as moment from "moment-timezone";
import momentjs from "moment";
import { unlink } from "fs";
import { logger } from "./logger";
import path from "path";
import { Request } from "express";
import { IUser } from "../types/User";
import jwt from "jsonwebtoken";

type TimeSlot = {
  startTime: string;
  endTime: string;
};

export const validateTimeSlots = (timeSlots: TimeSlot[]) => {
  if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
    return "Time slots are missing.";
  }

  for (let i = 0; i < timeSlots.length - 1; i++) {
    const currentSlot = timeSlots[i];
    const nextSlot = timeSlots[i + 1];

    const currentEndTime = currentSlot.endTime;
    const nextStartTime = nextSlot.startTime;

    if (currentEndTime != nextStartTime) {
      return `There cannot be a gap between previous end time ${currentEndTime} and next start time ${nextStartTime}.`;
    }

    if (i > 0) {
      const prevSlot = timeSlots[i - 1];
      const prevEndTime = prevSlot.endTime;

      if (currentSlot.startTime != prevEndTime) {
        return `There cannot be a gap between previous end time ${prevEndTime} and next start time ${currentSlot.startTime}.`;
      }

      if (currentSlot.startTime < prevEndTime) {
        return `Start time ${currentSlot.startTime} should be greater than previous end time ${prevEndTime}.`;
      }
    }
  }

  return null;
};

export const convertDatetoLocalTZ = (date = Date.now()): Date => {
  return moment.tz(date, process.env.TIME_ZONE!).toDate();
};

export const convertDatetUTCString = (timesheetDate: string, time: any) => {
  // let offset = new Date().getTimezoneOffset();
  let d = new Date(`${timesheetDate} ${time}:00 +530`);
  // d.setTime(d.getTime() - offset * 60000);
  return d.toUTCString();
  // const localDateTime = moment.tz(`${timesheetDate} ${time}`, timezone);
  // console.log("Local date time:", localDateTime.toDate());
  // const utcDateTime = localDateTime.clone().utc().toDate();
  // const utcDateTime = localDateTime
  //   .utc()
  //   .format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(GMT)]");
  // const utcDateTime = new Date(localDateTime.toDate()).toUTCString();
  // console.log("UTC date time:", utcDateTime);
  // return utcDateTime;
};

/* Calculate next Friday */
const getNextFriday = (date = new Date()) => {
  const dateCopy = new Date(date.getTime());
  const nextFriday = new Date(
    dateCopy.setDate(
      dateCopy.getDate() + ((7 - dateCopy.getDay() + 5) % 7 || 7)
    )
  );
  return nextFriday;
};

/**
 * Return weeks of month with start and end dates
 * @param year
 * @param month
 * @returns weeks [ {start, end}, {start, end} ]
 */
export const getWeeksOfMonth = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  /* Day starts on Monday of this week (even if it's end of prev month) */
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
  /* Last day of month 28/20/31 */
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const weeks = [];
  /* Loop till end of month and create weeks array with start and end date */
  // while (startDate.getMonth() <= lastDayOfMonth.getMonth()) {

  while (
    startDate.getFullYear() === lastDayOfMonth.getFullYear() &&
    startDate.getMonth() <= lastDayOfMonth.getMonth() &&
    startDate <= lastDayOfMonth
  ) {
    const nextDate = getNextFriday(startDate);
    weeks.push({
      start: `${momentjs(startDate).format("YYYY-MM-DD")} 00:00:00+000`,
      end: `${momentjs(nextDate).format("YYYY-MM-DD")} 00:00:00+000`,
    });
    startDate.setDate(startDate.getDate() + 7);
  }
  return weeks;
};

export const convertHtmlToText = (str: string) => {
  return str.replace(/<[^>]+>/g, "");
};

export const removeFile = async (filename: string) => {
  const filepath = path.join(process.env.FILE_UPLOAD_FOLDER!, filename);
  await unlink(filepath, (err) => {
    if (err) {
      return logger.info(`Error removing file ${filepath} `, err);
    }
    logger.info("Deleted file: ", filepath);
  });
};

export const userObjWithImageURL = (req: Request, tempUser: any) => {
  if (tempUser.profileImage) {
    // const protocol = req.protocol;
    const protocol =
      process.env.ENVIRONMENT === "local" ? "http://" : "https://";
    let baseURL = protocol + req.get("host") + "/";
    tempUser.profileImageThumb =
      baseURL +
      process.env.FILE_UPLOAD_FOLDER! +
      process.env.THUMB_PREFIX! +
      tempUser.profileImage;
    tempUser.profileImage =
      baseURL + process.env.FILE_UPLOAD_FOLDER + tempUser.profileImage;
  }
  return tempUser;
};

export const generateUserTokens = (user: IUser) => {
  const userJwtObj = {
    id: (user as IUser)._id,
    email: (user as IUser).email,
  };
  const accessToken = jwt.sign(userJwtObj, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign(userJwtObj, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  });
  return { accessToken, refreshToken };
};
