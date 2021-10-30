# WebTechStudy

Web関連の技術の勉強。

POSTとGETでデータを受け取ってレスポンスを返す方法、クッキーを使う方法、ＤＢへのアクセス方法、CORS対応くらいできればあとはなんとかなるんじゃない？

# 1. FastAPI

新鋭のAPIサーバ用Webフレームワーク。python。
ドキュメントがしっかりしているのでいつかはそちらを見たほうがいい。

https://fastapi.tiangolo.com/ja/

APIに特化しているおかげでAPIサーバを作る上で気が利いている感じがする。
ドキュメントが自動生成されるのが非常に良い。

仕事で使うには新しすぎて説得で苦労する場合もあるかもしれない。(github上で一番古いtagが打たれた日付はバージョン0.1.11の2018年12月16日)

## 1-0. Pythonの仮想環境

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

## 1-1. プロジェクト作成

## 1-2. ライブラリインストール

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

## 1-3. 起動

```
uvicorn server:app --host="0.0.0.0" --port=8080
```


## 1-4. GETを受け取ってJSONを返す

FastAPIのインスタンスを作って、そのインスタンスのgetというアノテーションを使ってこのURLにきたらこのメソッドを実行するんだよ、と教えてあげる。オブジェクトを渡すとJSONを返してくれる。

```
from fastapi import FastAPI
app = FastAPI()
@app.get('/index.html')
def index():
    return {"status": "ok"}
```

## 1-5. POSTを受け取ってJSONを返す

POSTの場合はpostというアノテーションを使うだけ。

```
from fastapi import FastAPI
app = FastAPI()
@app.post('/index.html')
def index():
    return {"status": "ok"}
```

## パスパラメータ

パスの一部が可変の場合への対応。
アノテーションの部分に受け取る変数名を書き、関数定義の引数にその変数を書いて受け取る。
関数の引数のほうで型を指定することもできる。

```
from fastapi import FastAPI
app = FastAPI()
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}
```

https://fastapi.tiangolo.com/ja/tutorial/path-params/


## クエリパラメータ

URLの後半の?以降にパラメータを並べるやつ。

https://fastapi.tiangolo.com/ja/tutorial/query-params/

バリデーションもできる

https://fastapi.tiangolo.com/ja/tutorial/query-params-str-validations/

## リクエストボディ

https://fastapi.tiangolo.com/ja/tutorial/body/

## エラーを返す

例外を投げるとエラーレスポンスがかえる。賢い。

```
from fastapi import FastAPI, HTTPException
app = FastAPI()
@app.get('/{key}')
def home(key: int):
    if key >= 100:
        raise HTTPException(status_code: 404, detail="not found")
    return {"status": "ok"}
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


## JWT



## DBアクセス

長く使うシステムでORマッパ使うとかマジで意味が分からない。PythonでPostgreSQLにアクセスするならpsycopg2がデファクトスタンダードになっていると考えてよいと思う。

https://www.psycopg.org/

MySQLはしらない。

# 2. node.js / express

フロントエンドエンジニアがサーバサイドにやってくるならば同じ言語で書けるのでnode.jsが良いかも。
FastAPIもpythonにして速い気がするがやっぱりnodeは速い。

ちなみにgithub上で一番古いtagが打たれた日付はバージョン0.1の2010年1月3日)

## 2-1. プロジェクトの作成

```
npx express-generator プロジェクトフォルダへのパス
```

APIサーバとして使う場合はviewが要らないだろうから、オプションで--no-viewを指定すると良いかも。


## リクエストの受け取り方とJSONの返し方


## エラーを返す

## データの受け取り方

### パスパラメータ

```
const express = require('express');
const app = express();
app.get('/items/:item_id', (req, res) => {
    res.json({'item_id': item_id});
});
```

### クエリパラメータ

req.query.変数名 でとる。

```
const express = require('express');
const app = express();
app.get('/items', (req, res) => {
    res.json({'item_id': req.query.item_id});
});
```

### リクエストボディ　Form編

```
const express = require('express');
const parser = require('body-parser');
conset app = express();
app.use(parser.urlencoded({ extended: true }));
app.get('/items', (req, res) => {
    res.json({'item_id': req.body.item_id});
})
```

### リクエストボディ　JSON編

body-parserを使うようにしておいて、req.body.変数名 で取得する。

```
const express = require('express');
const parser = require('body-parser');
conset app = express();
app.use(parser.json);
app.get('/items', (req, res) => {
    res.json({'item_id': req.body.item_id});
})
```

## クッキー

### 設定

### 参照

### 削除

## JWT

## DBアクセス


# 3. React

```
npx create-react-app プロジェクトフォルダへのパス
```

ただし、ちゃんとプロジェクトを作る場合はこうではなくて設定ファイルをきちんと手で書くものらしい。
実際create-react-appではセキュリティに問題があるらしいパッケージがやまほどインストールされるので使っていて恐ろしさがある。

手で書く方法はこれから勉強する予定。



# 4. おまけ テスト用のPostgreSQLを立てる

docker-compose.ymlを作っておいてdocker-compose upであげるのが楽ちんだと思う。

```
services:
    db:
        image: postgres:13
        container_name: postgresql
        ports:
            - 5432:5432
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: postgres
            POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --no-locale"
        volumes:
            - ./pgdata:/var/lib/postgresql/data
            - ./pginit:/docker-entrypoint-initdb.d
```

pgdataフォルダがこのPostgreSQLのデータフォルダになる。
pginitフォルダ内に拡張子が.sqlのファイルを置き、そのなかにDBを初期化するSQLを書いておく。CREATE TABLEとかINSERTとかそういうやつ。pgdataフォルダが空の時だけそのSQLが実行されて初期化してくれる。


