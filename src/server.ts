import app from "./app";
import routes from "./routes";
import { NextFunction, Request, Response } from "express";
import { logger } from "./utils/logger";
import mongoose, { ConnectOptions } from "mongoose";

logger.info(`DB connection string, port: ${JSON.stringify(process.env)} `);

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
  console.error(err);
  // process.exit(1);
});

mongoose.connection.on("disconnected", (res) => {
  logger.warn("MongoDB disconnected:", res);
});

// Enable query logging
mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});
/* DB connection code ends */

app.use("/", routes);

// Custom error handling middleware for 500 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Error found: ", err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

export const conn = app.listen(port, () => {
  logger.info(`Server is running in port ${port}`);
});

export default app;
