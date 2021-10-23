



# プロジェクト作成方法

```
npx express-generator -v ejs --git node_de_cookie
cd node_de_cookie
npm install
```


# クッキーの保存方法

```
    res.cookie('username', username, {
      maxAge: 30 * 1000,
      httpOnly: false
    })
```

# クッキーの削除方法

```
  res.clearCookie("username");
```


