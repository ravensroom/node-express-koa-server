const env = process.env.NODE_ENV;

let MYSQL_CONF;

let REDIS_CONF;

if (env === 'dev') {
  REDIS_CONF = {
    host: 'localhost',
    port: 6379,
  };
}

if (env === 'prodection') {
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

if (env === 'prodection') {
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
