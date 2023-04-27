const { exec, escape } = require('../db/mysql');
const xss = require('xss');

const getList = (author, keyword) => {
  if (author != '') author = escape(xss(author));
  if (keyword != '') keyword = escape(xss(keyword));
  let sql = 'select * from blogs where 1=1 ';
  if (author) {
    sql += `and author=${author} `;
  }
  if (keyword) {
    sql += `and (title like '%${keyword}' or content like '%${keyword}%') `;
  }
  sql += `order by createtime desc`;
  return exec(sql);
};

const getDetail = (id) => {
  id = escape(xss(id));
  const sql = `select * from blogs where id=${id}`;
  return exec(sql).then((rows) => rows[0]);
};

const newBlog = (blogData) => {
  let { title, content, author } = blogData;
  title = escape(xss(title));
  content = escape(xss(content));
  author = escape(xss(author));
  const createTime = Date.now();
  const sql = `insert into blogs (title, content, createtime, author) values(${title}, ${content}, ${createTime}, ${author});`;
  return exec(sql).then((insertData) => {
    return insertData.insertId;
  });
};

const updateBlog = (id, blogData = null) => {
  let { title, content } = blogData;
  title = escape(xss(title));
  content = escape(xss(content));
  const sql = `update blogs set title=${title}, content=${content} where id=${id};`;
  return exec(sql).then((updateData) => {
    return updateData.affectedRows > 0 ? true : false;
  });
};

const deleteBlog = (id, author) => {
  id = escape(xss(id));
  author = escape(xss(author));
  const sql = `delete from blogs where id=${id} and author=${author};`;
  return exec(sql).then((delData) => {
    return delData.affectedRows > 0 ? true : false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog,
};
