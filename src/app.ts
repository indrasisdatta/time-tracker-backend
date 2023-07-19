import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose, { ConnectOptions, mongo } from "mongoose";
import bodyParser from "body-parser";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.DB_CON_STR!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions);

mongoose.connection.on("connected", () => {
  console.error("MongoDB connection successful");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

mongoose.connection.on("disconnected", (res) => {
  console.error("MongoDB disconnected:", res);
});

export default app;
