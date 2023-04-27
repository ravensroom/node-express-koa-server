var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');

router.post('/login', function (req, res, next) {
  const { username, password } = req.body;
  const result = login(username, password);
  result.then((data) => {
    if (data.username) {
      req.session.username = data.username;
      // will automatically sync to redis
      // set(req.sessionId, req.session);
      res.json(new SuccessModel());
      return;
    }
    res.json(new ErrorModel('Failed to login'));
  });
});

module.exports = router;
