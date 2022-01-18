import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

let dummy_database = [];

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view eingine", "ejs");
app.use(express.urlencoded({ extended: false }));

// セッションにユーザ情報を保持るので、express-sessionをuseしておく必要あり。
app.use(
  session({
    secret: "himitsu",
    resave: true,
    saveUninitialized: false,
  })
);

//
// 渡された情報に合致するユーザがいるかを調べる
//
const verify = (username, password, done) => {
  console.log("verify(", username, ", ", password, ")");
  for (let i = 0; i < dummy_database.length; i++) {
    const u = dummy_database[i];
    console.log("compare", username, password, u);
    if (u.login_id == username && u.password == password) {
      console.log("matched");
      return done(null, u);
    }
  }
  console.log("NOT matched");
  return done(null, null, { message: "not found" });
};

//
const strategy = new LocalStrategy(
  {
    usernameField: "login_id",
    passwordField: "password",
  },
  verify
);

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res: express.Response) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

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
