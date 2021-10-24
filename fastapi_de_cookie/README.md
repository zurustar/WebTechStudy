
# FastAPIでクッキーを使う


## 準備

```
python -m venv .venv
./.venv/script/activate
pip install -r ./requirements.txt
```

## 起動

```
uvicorn server:app --host="0.0.0.0" --port=3000 --reload
```

ブラウザで http://localhost:3000/index.html にアクセスしてください。


## クッキー

### 設定

ここに書いてある。

https://fastapi.tiangolo.com/advanced/response-cookies/


### 取得

ここに書いてある。

https://fastapi.tiangolo.com/tutorial/cookie-params/

ざっくりいうと、取得は関数の引数でクッキーを受けるイメージ。

## 静的ファイルの配信

aiofilesを使う。

ここに書いてある。

https://fastapi.tiangolo.com/tutorial/static-files/

