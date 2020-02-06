import bodyParser from "body-parser";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

app.get("/ping", (req, res) => {
  res.json({
    message: "pong"
  });
});

app.listen(config.PORT, () => console.log(`listening on port ${config.PORT}`));
