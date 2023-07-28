import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cors from "cors";

import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app: Express = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* Swagger API */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default app;
