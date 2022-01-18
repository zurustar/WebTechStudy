import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// passportの勉強用なのでDBはローカル変数でごまかす
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
  for (let i = 0; i < dummy_database.length; i++) {
    const u = dummy_database[i];
    if (u.login_id == username && u.password == password) {
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

//
// ログイン画面の表示
//
app.get("/login", (req, res) => res.render("login.ejs"));

//
// ログイン処理(passportに委ねる)
//
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login", // 認証失敗時のリダイレクト先
    successRedirect: "/", // 認証成功時のリダイレクト先
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
  const u = {
    login_id: req.body.login_id,
    email: req.body.email,
    realname: req.body.realname,
    password: req.body.password, // TODO: ハッシュ化すべき
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

app.listen(3000);
