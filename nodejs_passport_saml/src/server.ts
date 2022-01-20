import { config as DotEnvConfig } from "dotenv";
DotEnvConfig();

import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as SAMLStrategy } from "passport-saml";

const app = express();
app.set("view engine", "ejs");

const verify = (profile, done) => {};

const strategy = new SAMLStrategy({ path: "/", cert: "dummy" }, verify);

passport.use(strategy);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post(
  "/login",
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate("saml", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.listen(3000);
