# WebTechStudy

Web 関連の技術の勉強。

POST と GET でデータを受け取ってレスポンスを返す方法、クッキーを使う方法、ＤＢへのアクセス方法、CORS 対応くらいできればあとはなんとかなるんじゃない？

# 1. FastAPI

新鋭の API サーバ用 Web フレームワーク。python。
ドキュメントがしっかりしているのでいつかはそちらを見たほうがいい。

https://fastapi.tiangolo.com/ja/

API に特化しているおかげで API サーバを作る上で気が利いている感じがする。
ドキュメントが自動生成されるのが非常に良い。

仕事で使うには新しすぎて説得で苦労する場合もあるかもしれない。(github 上で一番古い tag が打たれた日付はバージョン 0.1.11 の 2018 年 12 月 16 日)

## 1-0. Python の仮想環境

FastAPI に限った話ではないが。

とりあえず作る。

```
python -m venv .venv
```

有効化。bash の場合

```
source ./venv/scripts/activate
```

有効化。PowerShell の場合

```
./.venv/Scripts/Activate.ps1
```

## 1-1. プロジェクト作成

## 1-2. ライブラリインストール

プロジェクトのフォルダに requirements.txt というファイルを作り以下のようなことを書く。

```
fastapi
uvicorn
psycopg2
```

そしてこのファイルに書いたライブラリをインストールするためのコマンドを実行する。

```
pip install -r ./requirements.txt
```

pip で直接ライブラリをインストールしても良いのだが、こうしておくと requirements.txt を共有することで別の環境でも簡単に必要なライブラリをインストールすることができる。

## 1-3. 起動

```
uvicorn server:app --host="0.0.0.0" --port=8080
```

## 1-4. GET を受け取って JSON を返す

FastAPI のインスタンスを作って、そのインスタンスの get というアノテーションを使ってこの URL にきたらこのメソッドを実行するんだよ、と教えてあげる。オブジェクトを渡すと JSON を返してくれる。

```
from fastapi import FastAPI
app = FastAPI()
@app.get('/index.html')
def index():
    return {"status": "ok"}
```

## 1-5. POST を受け取って JSON を返す

POST の場合は post というアノテーションを使うだけ。

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

URL の後半の?以降にパラメータを並べるやつ。

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

API のエントリポイントとなる関数の引数で Response 型のオブジェクトを受け取っておいて、そのメソッドである set_cookie でクッキーに値を設定することができる。

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

API のエントリポイントとなる関数の引数で Cookie 型のオブジェクトを受け取る。Optional として設定しておかないと Cookie が設定されていなかった場合に勝手にエラーを返されるので注意。

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

設定と同じメソッドの max_age を 0 にして呼び出すと削除される。

## JWT

## DB アクセス

長く使うシステムで OR マッパ使うとかマジで意味が分からない。Python で PostgreSQL にアクセスするなら psycopg2 がデファクトスタンダードになっていると考えてよいと思う。

https://www.psycopg.org/

MySQL はしらない。

# 2. node.js / express

フロントエンドエンジニアがサーバサイドにやってくるならば同じ言語で書けるので node.js が良いかも。
FastAPI も python にして速い気がするがやっぱり node は速い。

ちなみに github 上で一番古い tag が打たれた日付はバージョン 0.1 の 2010 年 1 月 3 日)

## 2-1. プロジェクトの作成

```
npx express-generator プロジェクトフォルダへのパス
```

API サーバとして使う場合は view が要らないだろうから、オプションで--no-view を指定すると良いかも。

## リクエストの受け取り方と JSON の返し方

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

### リクエストボディ　 Form 編

```
const express = require('express');
const parser = require('body-parser');
conset app = express();
app.use(parser.urlencoded({ extended: true }));
app.get('/items', (req, res) => {
    res.json({'item_id': req.body.item_id});
})
```

### リクエストボディ　 JSON 編

body-parser を使うようにしておいて、req.body.変数名 で取得する。

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

## DB アクセス

## ドキュメンテーション

FastAPI だと勝手にドキュメントを生成していくれるが、express だとそうは行かかないので、ちょっと追加でパッケージの導入などが必要になる。

```
npm install swagger-ui-express swagger-jsdoc
```

インストールしたパッケージを使う。

```
const express = require('express);
const swaggertUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
app.use(
  "/spec",
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: "じっけんAPI",
          version: "0.0.1",
        },
      },
      apis: ["./routes/*.js"],
    })
  )
);
```

あとは、API のエンドポイントを実装している関数の前に JSDoc で API の定義を頑張って書く。

書く内容はがんばってここを読み解く。
https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md

# 3. React

```
npx create-react-app プロジェクトフォルダへのパス
```

ただし、ちゃんとプロジェクトを作る場合はこうではなくて設定ファイルをきちんと手で書くものらしい。
実際 create-react-app ではセキュリティに問題があるらしいパッケージがやまほどインストールされるので使っていて恐ろしさがある。

手で書く方法はこれから勉強する予定。

# 4. おまけ テスト用の PostgreSQL を立てる

docker-compose.yml を作っておいて docker-compose up であげるのが楽ちんだと思う。

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

pgdata フォルダがこの PostgreSQL のデータフォルダになる。
pginit フォルダ内に拡張子が.sql のファイルを置き、そのなかに DB を初期化する SQL を書いておく。CREATE TABLE とか INSERT とかそういうやつ。pgdata フォルダが空の時だけその SQL が実行されて初期化してくれる。
