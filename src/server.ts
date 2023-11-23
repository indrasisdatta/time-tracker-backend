import app from "./app";
import routes from "./routes";
import { NextFunction, Request, Response } from "express";
import { logger } from "./utils/logger";
import mongoose, { ConnectOptions } from "mongoose";
import express from "express";
import path from "path";
import { existsSync } from "fs";

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

app.get("/", (req: Request, res: Response) => {
  return res.send("App is running");
});

/* Access uploaded image */
const uploadFolderName = process.env.FILE_UPLOAD_FOLDER?.replace("/", "");
app.use(
  `/${uploadFolderName}`,
  express.static(path.join(__dirname, "../../", uploadFolderName!))
);
// if (process.env.ENVIRONMENT === "local") {
//   /* Uploads folder path */
//   app.use(
//     `/${uploadFolderName}`,
//     express.static(path.join(__dirname, "../../", uploadFolderName!))
//   );
// } else {
//   /* Uploads folder path */
//   app.use(`/${uploadFolderName}`, (req, res, next) => {
//     express.static(path.join(__dirname, "../../", uploadFolderName!));
//   });
// }

/* Check if file exists */
app.use(`/uploads-exists/:fileName`, (req, res, next) => {
  let fileName = req.params.fileName;
  let filePath = `${__dirname}${path.sep}..${path.sep}..${
    path.sep
  }${uploadFolderName!}${path.sep}${fileName}`;
  logger.info("Upload Folder path: " + filePath);
  console.log("Upload Folder path: ", filePath);
  let exists = existsSync(filePath);
  logger.info("Folder exists: " + exists);
  console.log("Folder exists: ", exists);
  res.send(exists);
});

/* URL routes */
app.use("/", routes);

/* Custom error handling middleware for 500 errors */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error caught! ", err);
  logger.error("Error found: ", err.stack);
  res
    .status(500)
    .json({ status: "error", message: "Internal Server Error", error: err });
});

export const conn = app.listen(port, () => {
  logger.info(`Server is running in port ${port}`);
});

export default app;
