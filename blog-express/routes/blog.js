var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/resModel');
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require('../controller/blog');
const loginCheck = require('../middleware/loginCheck');

router.get('/list', (req, res, next) => {
  const author = req.query.author || '';
  const keyword = req.query.keyword || '';

  if (req.query.isadmin) {
    if (req.session.username == null) {
      res.json(new ErrorModel('Please login'));
      return;
    }
    author = req.session.username;
  }

  const result = getList(author, keyword);
  result.then((listData) => {
    res.json(new SuccessModel(listData));
  });
});

router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id);
  result.then((data) => res.json(new SuccessModel(data)));
});

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  result.then((data) => res.json(new SuccessModel(data)));
});

router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel('Failed to update'));
    }
  });
});

router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = deleteBlog(req.query.id, author);
  result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel('Failed to delete'));
    }
  });
});

module.exports = router;
