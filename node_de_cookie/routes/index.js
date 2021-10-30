var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  let username = req.cookies.username;
  console.log("username = ", username);
  res.render("index", { username: username });
});

router.get("/login", function (req, res) {
  res.render("login", { message: "" });
});

router.post("/login", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  if (username === "user01" && password === "user01") {
    res.cookie("username", username, {
      maxAge: 30 * 1000,
      httpOnly: false,
    });
    res.render("index", { username: username });
  } else {
    res.render("login", { message: "なんか間違ってます。" });
  }
});

router.get("/logoff", function (req, res) {
  res.clearCookie("username");
  res.render("logoff");
});

module.exports = router;
