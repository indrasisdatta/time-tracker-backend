import { Router } from "express";
import {
  getDailyRecords,
  getReportData,
  getTimesheetSummary,
  getWeeklyProductiveTime,
  saveTimesheet,
  timesheetCalendar,
} from "../controllers/timesheetController";
import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();
router.post("/save", validationMiddleware("timesheet"), saveTimesheet);
router.get("/weekly_time/:yearMonth", getWeeklyProductiveTime);
router.get("/:date", getDailyRecords);
router.post(
  "/summary",
  validationMiddleware("timesheet_summary"),
  getTimesheetSummary
);
router.post(
  "/calendar",
  validationMiddleware("timesheet_summary"),
  timesheetCalendar
);
router.post("/report", validationMiddleware("report_search"), getReportData);

export default router;
