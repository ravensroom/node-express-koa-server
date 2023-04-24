const { SuccessModel, ErrorModel } = require('../model/resModel');
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
} = require('../controller/blog');

const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('Please login'));
  }
};

const handleBlogRouter = (req, res) => {
  const method = req.method;
  const id = req.query.id;

  if (method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || '';
    const keyword = req.query.keyword || '';
    if (req.query.isadmin) {
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) return loginCheckResult;
      author = req.session.username;
    }
    const result = getList(author, keyword);
    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }

  if (method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id);
    return result.then((data) => new SuccessModel(data));
  }

  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) return loginCheckResult;
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then((data) => new SuccessModel(data));
  }

  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) return loginCheckResult;
    const result = updateBlog(id, req.body);
    return result.then((val) => {
      if (val) return new SuccessModel();
      return new ErrorModel('Failed to update blog');
    });
  }

  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) return loginCheckResult;
    req.body.author = req.session.username;
    const result = deleteBlog(id, req.body.author);
    return result.then((val) => {
      if (val) return new SuccessModel();
      return new ErrorModel('Failed to update blog');
    });
  }
};
module.exports = handleBlogRouter;
