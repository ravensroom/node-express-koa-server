const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

const handleUserRouter = (req, res) => {
  const method = req.method;

  if (method === 'GET' && req.path === '/api/user/login') {
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then((data) => {
      if (data.username) {
        return new SuccessModel();
      }
      return new ErrorModel('Failed to login');
    });
  }
};

module.exports = handleUserRouter;
