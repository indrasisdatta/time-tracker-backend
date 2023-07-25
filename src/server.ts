import app from "./app";
import routes from "./routes";
import { NextFunction, Request, Response } from "express";
import { logger } from "./utils/logger";

const port = process.env.PORT;

app.use("/", routes);

// Custom error handling middleware for 500 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Error found: ", err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info(`Server is running in port ${port}`);
});
