



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

// ドキュメント生成用
import swaggerUi  from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
app.use(
  "/spec",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: "じっけんAPI",
          version: "0.0.1",
          description: "なんやかんや"
        },
      },
      apis: ["./app.js", "./routes/index.js"],
    })
  )
);



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v0", indexRouter);

module.exports = app;
