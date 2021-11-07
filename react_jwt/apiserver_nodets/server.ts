



import express from "express";
import path  from "path";
import cookieParser  from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";

const app: express.Express = express();

import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v0", indexRouter);

export default app;
