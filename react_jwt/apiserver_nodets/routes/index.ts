import express from "express";

const router = express.Router();

import jwt, { JwtPayload } from "jsonwebtoken";


class User {
  username: string;
  password: string;
  user_id: string;
  realname: string;
  constructor(username: string, password: string, user_id: string, realname: string) {
    this.username = username;
    this.password = password;
    this.user_id = user_id;
    this.realname = realname;
  }
}

const db = [
  new User("user01", "user01", "100", "ore"),
  new User("user02", "user02", "101", "anata"),
];

const secretKey = "fjkfjkfjkfjkfjk";




function generateJWT(user_id: string): string {
  return jwt.sign({ sub: user_id }, secretKey, { expiresIn: "1h" });
};

function setToken(user_id: string, res: express.Response): string {
  let token = generateJWT(user_id);
  res.cookie("access_token", token, {
    maxAge: 60 * 1000,
    httpOnly: false,
  });
  return token;
};

function getUserId(req: {user_id: string}) {
  return req.user_id;
}

function verifyToken(req: express.Request): string {
  if (req.cookies.access_token) {
    try {
      let payload = jwt.verify(req.cookies.access_token, secretKey);
      if(typeof(payload)==="object") {
        if(typeof(payload.sub) !== 'undefined') {
          return payload.sub;
        }
      }
    } catch(err: any) {
      ;
    }
  }
  return "";
};

function searchUserById(user_id: string): (User | null) {
  if(user_id !== "") {
    for (let i = 0; i < db.length; i++) {
      if (db[i].user_id === user_id) {
        return db[i];
      }
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
router.get("/me", function (req: express.Request, res: express.Response) {
  let user_id = verifyToken(req);
  if(user_id !== "") {
    let user = searchUserById(user_id);
    if (user !== null) {
      setToken(user_id, res);
      res.json({ username: user.username, realname: user.realname });
      return
    }
  }
  res.json({ username: "" });
});

function searchUserByUsernameAndPassword(username: string, password: string) {
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

export default router;
