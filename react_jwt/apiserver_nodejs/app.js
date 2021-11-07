const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ドキュメント生成用
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
app.use(
  "/spec",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: "じっけんAPI",
          version: "0.0.1",
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
