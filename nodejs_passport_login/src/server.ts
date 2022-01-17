import { config as DotEnvConfig } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  DotEnvConfig();
}

// DBの代わり
const users = [];

//
import express from "express";
const app = express();
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// 通知
import flash from "express-flash";
app.use(flash());

// セッション
import session from "express-session";
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// ハッシュ化
import bcrypt from "bcrypt";

// 認証系
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username: string, password: string, done) => {
      const hashed_password = await bcrypt.hash(password, 10);
      console.log("***", username, password, hashed_password);
      for (let i = 0; i < users.length; i++) {
        console.log("compare", users[i].username, "and", username);
        if (users[i].username === username) {
          console.log("compare", users[i].password, "and", hashed_password);
          if (users[i].password === hashed_password) {
            return done(null, { realname: "会員" });
          }
          return done(null, false, { message: "invalid password" });
        }
      }
      return done(null, false, { message: "user not found" });
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// ----------------------------------------------------------------------------
app.get("/", (req: express.Request, res: express.Response) => {
  let realname = "あなただれ";
  if (typeof req.user !== "undefined") {
    if (typeof req.user["realname"] !== "undefined") {
      realname = req.user["realname"];
    }
  }
  res.render("index.ejs", { name: realname });
});

// ----------------------------------------------------------------------------
app.get("/login", (req: express.Request, res: express.Response) => {
  res.render("login.ejs");
});

// ----------------------------------------------------------------------------
//
// 認証処理はpassportにオマカセ
//
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// ----------------------------------------------------------------------------
app.get("/register", (req: express.Request, res: express.Response) => {
  res.render("register.ejs");
});

// ----------------------------------------------------------------------------
app.post("/register", async (req: express.Request, res: express.Response) => {
  console.log("POST /register");
  try {
    const hashed_password = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.username, req.body.password, hashed_password);
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      email: req.body.email,
      password: hashed_password,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

// ----------------------------------------------------------------------------
app.listen(3000);
