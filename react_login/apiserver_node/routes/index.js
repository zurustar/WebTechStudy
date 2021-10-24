var express = require('express');
var router = express.Router();


const db = [{username: 'user01', password: 'user01', user_id: 100, realname: 'ore'}]

function searchUserById(user_id) {
  user_id = parseInt(user_id, 10);
  for(let i=0;i<db.length;i++) {
    if(db[i].user_id === user_id) {
      return db[i];
    }
  }
  console.log('  NOT found');
  return null;
}

router.get('/me', function(req, res) {
  let user_id = req.cookies.user_id;
  let user = searchUserById(user_id);
  if(user !== null) {
    res.cookie('user_id', user.user_id, {maxAge: 60*1000, httpOnly: false}); // update
    res.json({username: user.username, realname: user.realname});
  } else {
    res.json({username: ''});
  }
});

function searchUser(username, password) {
  for(let i=0;i<db.length;i++) {
    if((db[i].username === username) && (db[i].password === password)) {
      return db[i];
    }
  }
  return null;
}

router.post('/login', function(req, res) {
  let user = searchUser(req.body.username, req.body.password);
  res.cookie('user_id', user.user_id, {maxAge: 60*1000, httpOnly: false});
  res.json({user_id: user.user_id});
});

router.get('/logoff', function(req, res) {
  res.clearCookie('user_id');
  res.json({'user_id': ''});
})

module.exports = router;
