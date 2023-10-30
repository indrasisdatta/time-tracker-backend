import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";
// import passport from "./passport";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app: Express = express();

let corsConfig = {};
if (process.env.NODE_ENV === "local") {
  corsConfig = {
    origin: "*",
    // origin: [
    //   "http://localhost:3000",
    //   "http://127.0.0.1:3000",
    //   "http://192.168.1.6:3000",
    //   "https://time-tracker-frontend-ebon.vercel.app",
    // ],
  };
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsConfig));

/* Swagger API */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default app;
