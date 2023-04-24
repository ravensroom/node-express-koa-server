const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const { get, set } = require('./src/db/redis');

const serverHandle = (req, res) => {
  res.setHeader('Content-type', 'application/json');

  const url = req.url;
  req.path = url.split('?')[0];
  req.query = querystring.parse(url.split('?')[1]);

  // handle cookie
  req.cookie = [];
  const cookiestr = req.headers.cookie || ''; // k1=v1;k2=v2;k3=v3
  cookiestr.split(';').forEach((item) => {
    if (!item) return;
    const arr = item.trim().split('=');
    const [key, val] = arr;
    req.cookie[key] = val;
  });

  // handle session (using redis)
  let needSetCookie = false;
  let sessionId = req.cookie.sessionid;
  if (!sessionId) {
    needSetCookie = true;
    sessionId = `${Date.now()}_${Math.random()}`;
    set(sessionId, {});
  }
  req.sessionId = sessionId;
  get(sessionId)
    .then((sessionData) => {
      if (sessionData == null) {
        set(req.sessionId, {});
        req.session = {};
      } else {
        req.session = sessionData;
      }

      // handle routing
      return getPostData(req);
    })
    .then((postData) => {
      req.body = postData;

      const blogResult = handleBlogRouter(req, res);
      if (blogResult) {
        blogResult.then((blogData) => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `sessionid=${sessionId}; path='/'; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      const userResult = handleUserRouter(req, res);
      if (userResult) {
        userResult.then((userData) => {
          if (needSetCookie) {
            res.setHeader(
              'Set-Cookie',
              `sessionid=${sessionId}; path='/'; httpOnly; expires=${getCookieExpires()}`
            );
          }
          res.end(JSON.stringify(userData));
        });
        return;
      }

      res.writeHead(404, { 'Content-type': 'text/plain' });
      res.write('Page not found');
      res.end();
    });
};

const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }
    let postData = '';
    req.on('data', (chunk) => (postData += chunk.toString()));
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toUTCString();
};

module.exports = serverHandle;
