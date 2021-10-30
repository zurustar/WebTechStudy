# WebTechStudy
Web関連の技術の勉強。


# FastAPI

新鋭のAPIサーバ用Webフレームワーク。python。

## Pythonの仮想環境

FastAPIに限った話ではないが。

とりあえず作る。

```
python -m venv .venv
```

有効化。bashの場合

```
source ./venv/scripts/activate
```

有効化。PowerShellの場合

```
./.venv/Scripts/Activate.ps1
```

## クッキーの使い方

### 設定

APIのエントリポイントとなる関数の引数でResponse型のオブジェクトを受け取っておいて、そのメソッドであるset_cookieでクッキーに値を設定することができる。

こんなイメージ。

```
from fastapi import Cookie, FastAPI, Response

@app.get('/set_cookie')
def f(resp: Response):
    resp.set_cookie(key="変数名", value="変数の値", max_age=100, httponly=True)
    return {}
```

### 参照

APIのエントリポイントとなる関数の引数でCookie型のオブジェクトを受け取る。Optionalとして設定しておかないとCookieが設定されていなかった場合に勝手にエラーを返されるので注意。

こんなイメージ。

```
from fastapi import Cookie, FastAPI
from typing import Optional

@app.get('/get_cookie')
def f(変数名: Optional[str] = Cookie(None)):
    print(変数名)
    return {}
```




# node.js / express


## プロジェクトの作成

```
npx express-generator プロジェクトフォルダへのパス
```

APIサーバとして使う場合はviewが要らないだろうから、オプションで--no-viewを指定すると良いかも。

# React

```
npx create-react-app プロジェクトフォルダへのパス
```
