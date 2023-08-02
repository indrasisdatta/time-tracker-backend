import { Router } from "express";
import {
  getDailyRecords,
  saveTimesheet,
} from "../controllers/timesheetController";
import { validationMiddleware } from "../validators/validationMiddleware";

const router = Router();
router.post("/save", validationMiddleware("timesheet"), saveTimesheet);
router.get("/:date", getDailyRecords);

export default router;
