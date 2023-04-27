const espress = require('./espress');

const app = espress();

app.use((req, res, next) => {
  console.log('request began...', req.method, req.url);
  next();
});

app.use((req, res, next) => {
  console.log('set cookie');
  req.cookie = {
    sessionId: '123bn',
  };
  next();
});

app.use((req, res, next) => {
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200,
    };
  });
  console.log('set req body');
  next();
});

app.use('/api', (req, res, next) => {
  console.log('handling /api route');
  next();
});

app.get('/api', (req, res, next) => {
  console.log('handling /api get route');
  next();
});

app.post('/api', (req, res, next) => {
  console.log('handling /api post route');
  next();
});

function loginCheck(req, res, next) {
  console.log('login in succeeded');
  setTimeout(() => next());
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  console.log('handling /api get-cookie route');
  res.json({
    errno: 0,
    data: req.cookie,
  });
});

app.post('/api/get-post-data', (req, res, next) => {
  console.log('handling /api post get-post-data route');
  res.json({
    errno: 0,
    data: req.body,
  });
});

app.use((req, res, next) => {
  console.log('handling 404');
  res.json({
    errno: -1,
    msg: '404 not found',
  });
});

app.listen(3001, () => {
  console.log('server is running on port 3001');
});
