import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import timesheetRoutes from "./timesheetRoutes";
import userRoutes from "./userRoutes";
import { NextFunction, Request, Response } from "express";
import { API_STATUS } from "../config/constants";

const router = Router();

router.use("/category", categoryRoutes);
router.use("/timesheet", timesheetRoutes);
router.use("/user", userRoutes);

/* Health check URL */
router.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: API_STATUS.SUCCESS, data: "Server is running" });
});

/* Custom 404 error handler */
router.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ status: 0, message: "Not Found" });
});

export default router;
