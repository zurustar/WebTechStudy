from typing import Optional
from fastapi import Cookie, FastAPI, Response, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()


@app.get('/me')
def index(username: Optional[str] = Cookie(None)):
    return {"username": username}

class LoginInfo(BaseModel):
    username: str
    password: str

@app.post('/auth/login')
def login(login_info: LoginInfo, resp: Response):
    if((login_info.username == 'user01') and (login_info.password == 'user01')):
        # クッキーの設定
        resp.set_cookie(key="username", value=login_info.username, max_age=60, httponly=True)    
        return {}
    else:
         raise HTTPException(status_code=401, detail="failed to login")

@app.get('/auth/logoff')
def logoff(resp: Response):
    # クッキーの削除
    resp.set_cookie(key="username", value="", max_age=0, httponly=True)
    return {'message': 'ok'}

# /にすると他のURLが包含されてしまうので、一番最後にmountする必要あり
app.mount('/', StaticFiles(directory="static"), name="static")
