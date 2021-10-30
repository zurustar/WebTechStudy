
from fastapi import FastAPI, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ダミーのデータベース
db = [{"username": "user01", "password": "user01",
       "user_id": 100, "realname": "わたし"}]


def searchUserById(user_id):
    for u in db:
        if u['user_id'] == user_id:
            return u
    return None


@app.get('/me')
def me(resp: Response, user_id: Optional[int] = Cookie(None)):
    u = searchUserById(user_id)
    if u == None:
        return {"username": "", "realname": ""}
    resp.set_cookie(
        key="user_id", value=u["user_id"], max_age=60 * 1000, httponly=True)
    return {"username": u['username'], "realname": u['realname']}


def searchUser(username, password):
    for u in db:
        if (u["username"] == username) and (u["password"] == password):
            return u
    return None


class LoginInfo(BaseModel):
    username: str
    password: str


@app.post('/login')
def login(login_info: LoginInfo, resp: Response):
    u = searchUser(login_info.username, login_info.password)
    resp.set_cookie(
        key="user_id", value=u["user_id"], max_age=60 * 1000, httponly=True)
    return {"message": "ok"}


@app.get('/logoff')
def logoff(resp: Response):
    resp.set_cookie(key="user_id", value=None, max_age=0, httponly=True)
    return {"mesage": "ok"}
