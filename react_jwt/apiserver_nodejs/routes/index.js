const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const db = [
  { username: "user01", password: "user01", user_id: 100, realname: "ore" },
];

const secretKey = "fjkfjkfjkfjkfjk";

const generateJWT = (user_id) => {
  return jwt.sign({ sub: user_id }, secretKey, { expiresIn: "1h" });
};

const setToken = (user_id, res) => {
  let token = generateJWT(user_id);
  res.cookie("access_token", token, {
    maxAge: 60 * 1000,
    httpOnly: false,
  });
  return token;
};

const verifyToken = (req, res, next) => {
  if (req.cookies.access_token) {
    jwt.verify(req.cookies.access_token, secretKey, (err, payload) => {
      if (!err) {
        req.user_id = payload.sub;
      }
    });
  }
  next();
};

function searchUserById(user_id) {
  user_id = parseInt(user_id, 10);
  for (let i = 0; i < db.length; i++) {
    if (db[i].user_id === user_id) {
      return db[i];
    }
  }
  console.log("  NOT found");
  return null;
}

/**
 * @swagger
 * /me:
 *   get:
 *     description: ログインしているユーザの情報を返却する
 *   produces:
 *     - application/json
 *   parameters:
 *   respones:
 *     200:
 *       description: ユーザ名とリアルネームを返すよ
 *
 */
router.get("/me", verifyToken, function (req, res) {
  let user = searchUserById(req.user_id);
  if (user !== null) {
    setToken(user.usr_id, res);
    res.json({ username: user.username, realname: user.realname });
  } else {
    res.json({ username: "" });
  }
});

function searchUserByUsernameAndPassword(username, password) {
  for (let i = 0; i < db.length; i++) {
    if (db[i].username === username && db[i].password === password) {
      return db[i];
    }
  }
  return null;
}

/**
 * @swagger
 * /login:
 *   post:
 *     description: ログインします。
 *   produces:
 *     - application/json
 *   parameters:
 *   respones:
 *     200:
 *       description: tokenを返す。
 *     404:
 *       description: ユーザ名とパスワードが一致するユーザがいなかった。
 *
 */
router.post("/login", function (req, res) {
  let user = searchUserByUsernameAndPassword(
    req.body.username,
    req.body.password
  );
  if (user === null) {
    res.status(404).json({ status: "user not found" });
  } else {
    let token = setToken(user.user_id, res);
    res.json({ token: token });
  }
});

/**
 * @swagger
 * /logoff:
 *   get:
 *     description: ログオフします。クッキーの無効化により実現。
 *   produces:
 *     - application/json
 *   responses:
 *     200:
 *       description: 成功
 */
router.get("/logoff", function (req, res) {
  res.clearCookie("access_token");
  res.json({ message: "ok" });
});

module.exports = router;
