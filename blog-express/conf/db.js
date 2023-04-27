const env = process.env.NODE_ENV;

let MYSQL_CONF;

let REDIS_CONF;

if (env === 'dev') {
  REDIS_CONF = {
    host: 'localhost',
    port: 6379,
  };
}

if (env === 'production') {
  REDIS_CONF = {
    host: 'localhost',
    port: 6379,
  };
}

if (env === 'dev') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'raven',
    password: '123.com!',
    port: 3306,
    database: 'myBlog',
  };
}

if (env === 'production') {
  MYSQL_CONF = {
    host: 'localhost',
    user: 'raven',
    password: '123.com!',
    port: 3306,
    database: 'myBlog',
  };
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
