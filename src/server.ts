import app from "./app";
import routes from "./routes";
import { NextFunction, Request, Response } from "express";
import { logger } from "./utils/logger";
import mongoose, { ConnectOptions } from "mongoose";

const port = process.env.PORT;

/* DB connection code starts */
mongoose.connect(process.env.DB_CON_STR!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connection successful");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
  process.exit(1);
});

mongoose.connection.on("disconnected", (res) => {
  logger.warn("MongoDB disconnected:", res);
});
/* DB connection code ends */

app.use("/", routes);

// Custom error handling middleware for 500 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Error found: ", err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

app.listen(port, () => {
  logger.info(`Server is running in port ${port}`);
});

export default app;
