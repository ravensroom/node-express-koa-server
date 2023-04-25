const { exec, escape } = require('../db/mysql');
const xss = require('xss');

const login = (username, password) => {
  username = escape(xss(username));
  password = escape(xss(password));
  const sql = `select username from users where username=${username} and password=${password};`;
  return exec(sql).then((rows) => rows[0] || {});
};

module.exports = {
  login,
};
