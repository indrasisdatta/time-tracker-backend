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
import { Auth } from "../middlewares/Auth";

const router = Router();
router.post(
  "/save",
  // Auth,
  validationMiddleware("timesheet"),
  saveTimesheet
);
router.get(
  "/weekly_time/:yearMonth",
  // Auth,
  getWeeklyProductiveTime
);
router.get(
  "/:date",
  // Auth,
  getDailyRecords
);
router.post(
  "/summary",
  // Auth,
  validationMiddleware("timesheet_summary"),
  getTimesheetSummary
);
router.post(
  "/calendar",
  // Auth,
  validationMiddleware("timesheet_summary"),
  timesheetCalendar
);
router.post(
  "/report",
  // Auth,
  validationMiddleware("report_search"),
  getReportData
);

export default router;
