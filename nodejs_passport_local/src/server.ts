import logger from "morgan";
import path from "path";
import crypto from "crypto";
import express from "express";
import { body, validationResult } from "express-validator";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import flash from "connect-flash";

// passportの勉強用なのでDBはローカル変数でごまかす
let dummy_database = [];

const app = express();

// 何はともあれロガー
app.use(logger("combined"));

// テンプレートエンジンとしてejsを使う。
app.set("views", path.join(__dirname, "views"));
app.set("view eingine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
  const shasum = crypto.createHash("sha1").update(password);
  const hashed_password = shasum.digest("hex");
  for (let i = 0; i < dummy_database.length; i++) {
    const u = dummy_database[i];
    if (u.login_id === username && u.password === hashed_password) {
      return done(null, u);
    }
  }
  return done(null, false, { message: "not found" });
};

//
// 認証方法の設定
//
const strategy = new LocalStrategy(
  {
    usernameField: "login_id",
    passwordField: "password",
  },
  verify
);
passport.use(strategy);

// シリアライズ＆デシリアライズ、、、中で文字列で管理しているのか？？？なぞ
passport.serializeUser((user, done) => done(null, JSON.stringify(user)));
passport.deserializeUser((user: string, done) => done(null, JSON.parse(user)));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//
// ログイン画面の表示
//
app.get("/login", (req, res) =>
  res.render("login.ejs", { message: req.flash("error") })
);

//
// ログイン処理(passportに委ねる)
//
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login", // 認証失敗時のリダイレクト先
    successRedirect: "/", // 認証成功時のリダイレクト先
    session: true,
    failureFlash: true,
  })
);

//
// ユーザ登録画面を表示する
//
app.get("/register", (req, res) => res.render("register.ejs"));

//
// ユーザ登録処理
//
app.post("/register", (req, res: express.Response) => {
  const shasum = crypto.createHash("sha1").update(req.body.password);
  const hashed_password = shasum.digest("hex");
  const u = {
    login_id: req.body.login_id,
    email: req.body.email,
    realname: req.body.realname,
    password: hashed_password,
  };
  dummy_database.push(u);
  res.redirect("/login");
});

//
// トップ画面の表示、ログインしているかどうかで表示を変える
//
app.get("/", (req, res: express.Response) => {
  res.render("index.ejs", { user: req.user });
});

//
// ログオフ
//
app.get("/logoff", (req, res) => {
  req.logout();
  res.redirect("/");
});

//
// express-validationを試す
//
app.post(
  "/validation",
  body("number").isInt(), // これがチェック処理。
  body("email").isEmail(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render("validation_result.ejs", { msgs: errors.array() });
      } else {
        res.render("validation_result.ejs", { msgs: null });
      }
    } catch (e) {
      res.status(500).end();
    }
  }
);
app.listen(3000);
