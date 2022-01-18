import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

let dummy_database = [];

const app = express();

// テンプレートエンジンとしてejsを使う。
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

// 認証方法の設定
const strategy = new LocalStrategy(
  {
    usernameField: "login_id",
    passwordField: "password",
  },
  verify
);
passport.use(strategy);

passport.serializeUser((user, done) => done(null, JSON.stringify(user)));
passport.deserializeUser((user: string, done) => done(null, JSON.parse(user)));

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
  console.log(req.session);
  console.log(req.user);
  res.render("index.ejs", { user: req.user });
});

app.listen(3000);
