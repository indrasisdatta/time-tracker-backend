import { Router } from "express";
import {
  getDailyRecords,
  getTimesheetSummary,
  saveTimesheet,
} from "../controllers/timesheetController";
import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();
router.post("/save", validationMiddleware("timesheet"), saveTimesheet);
router.get("/:date", getDailyRecords);
router.post(
  "/summary",
  validationMiddleware("timesheet_summary"),
  getTimesheetSummary
);

export default router;
