import app from "./app";
import routes from "./routes";

const port = process.env.PORT;

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
