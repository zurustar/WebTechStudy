import path from "path";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

let dummy_database = [];

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view eingine", "ejs");
app.use(express.urlencoded({ extended: false }));

// 渡された情報に合致するユーザがいるかを調べる
const verify = (username, password, done) => {
  let u = dummy_database.find((u) => {
    u.username == username && u.password == password;
  });
  if (u) {
    return done(null, u);
  }
  return done(null, null, { message: "not found" });
};

//
const strategy = new LocalStrategy(
  {
    usernameField: "usename",
    passwordField: "password",
  },
  verify
);

app.get("/login", (req, res: express.Response) => {
  res.render("login.ejs");
});

app.post("/login", (req, res: express.Response) => {
  console.log(req.body);
  res.redirect("/");
});

app.get("/register", (req, res: express.Response) => {
  res.render("register.ejs");
});

app.post("/register", (req, res: express.Response) => {
  const u = {
    login_id: req.body.login_id,
    email: req.body.email,
    realname: req.body.realname,
    password: req.body.password,
  };
  console.log(u);
  dummy_database.push(u);
  res.redirect("/login");
});

app.get("/", (req, res: express.Response) => {
  const user = req.user ?? {};
  res.render("index.ejs", { user: user });
});

app.listen(3000);
