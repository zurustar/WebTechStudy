# WebTechStudy

Web関連の技術の勉強。

POSTとGETでデータを受け取ってレスポンスを返す方法、クッキーを使う方法、ＤＢへのアクセス方法、CORS対応くらいできればあとはなんとかなるんじゃない？

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

## プロジェクト作成

## ライブラリインストール

プロジェクトのフォルダにrequirements.txtというファイルを作り以下のようなことを書く。

```
fastapi
uvicorn
psycopg2
```

そしてこのファイルに書いたライブラリをインストールするためのコマンドを実行する。

```
pip install -r ./requirements.txt
```

pipで直接ライブラリをインストールしても良いのだが、こうしておくとrequirements.txtを共有することで別の環境でも簡単に必要なライブラリをインストールすることができる。

## 起動

```
uvicorn server:app --host="0.0.0.0" --port=8080
```


## GETを受け取ってJSONを返す

FastAPIのインスタンスを作って、そのインスタンスのgetというアノテーションを使ってこのURLにきたらこのメソッドを実行するんだよ、と教えてあげる。オブジェクトを渡すとJSONを返してくれる。

```
from fastapi import FastAPI
@app.get('/index.html')
def index():
    return {"status": "ok"}
```

## POSTを受け取ってJSONを返す

POSTの場合はpostというアノテーションを使うだけ。

```
from fastapi import FastAPI
@app.post('/index.html')
def index():
    return {"status": "ok"}
```

## エラーを返す

例外を投げるとエラーレスポンスがかえる。賢い。

## パスパラメータ

パスの一部が可変の場合への対応。

https://fastapi.tiangolo.com/ja/tutorial/path-params/

## クエリパラメータ

URLの後半の?以降にパラメータを並べるやつ。

https://fastapi.tiangolo.com/ja/tutorial/query-params/

バリデーションもできる

https://fastapi.tiangolo.com/ja/tutorial/query-params-str-validations/

## リクエストボディ

https://fastapi.tiangolo.com/ja/tutorial/body/

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

詳細はこちらを参照。

https://fastapi.tiangolo.com/ja/advanced/response-cookies/


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

詳細はこちらを参照。

https://fastapi.tiangolo.com/ja/tutorial/cookie-params/

### 削除

設定と同じメソッドのmax_ageを0にして呼び出すと削除される。


## DBアクセス

長く使うシステムでORマッパ使うとかマジで意味が分からない。PythonでPostgreSQLにアクセスするならpsycopg2がデファクトスタンダードになっていると考えてよいと思う。

https://www.psycopg.org/

MySQLはしらない。

# node.js / express


## プロジェクトの作成

```
npx express-generator プロジェクトフォルダへのパス
```

APIサーバとして使う場合はviewが要らないだろうから、オプションで--no-viewを指定すると良いかも。


## リクエストの受け取り方

# React

```
npx create-react-app プロジェクトフォルダへのパス
```
