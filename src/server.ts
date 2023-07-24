import app from "./app";
import routes from "./routes";
import { NextFunction, Request, Response } from "express";

const port = process.env.PORT;

app.use("/", routes);

// Custom error handling middleware for 500 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
