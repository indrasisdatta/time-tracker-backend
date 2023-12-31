import { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import timesheetRoutes from "./timesheetRoutes";
import userRoutes from "./userRoutes";
import { NextFunction, Request, Response } from "express";

const router = Router();

router.use("/category", categoryRoutes);
router.use("/timesheet", timesheetRoutes);
router.use("/user", userRoutes);

// Custom 404 error handler
router.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ status: 0, message: "Not Found" });
});

export default router;
