const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redisClient = require('./db/redis');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  app.use(
    logger('dev', {
      stream: process.stdout, // default
    })
  );
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a',
  });
  app.use(
    logger('combined', {
      stream: writeStream,
    })
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new RedisStore({
  client: redisClient,
});

app.use(
  session({
    secret: 'Wjiol#9763j_5',
    cookie: {
      path: '/', //default
      httpOnly: true, //default
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
