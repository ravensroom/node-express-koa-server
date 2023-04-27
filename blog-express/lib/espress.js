const http = require('http');
const slice = Array.prototype.slice;

class Espress {
  constructor() {
    this.routes = [];
  }

  // Find the matching route and method for the incoming request
  match(req, route) {
    if (req.url === '/favicon.ico') {
      return false;
    }
    if (req.url.indexOf(route.path) === 0) {
      if (route.method === 'any' || req.method.toLowerCase() === route.method) {
        return true;
      }
    }
    return false;
  }

  // Register a middleware function with the 'any' method
  use() {
    this._register('any', arguments);
  }

  // Register a middleware function with the 'get' method
  get() {
    this._register('get', arguments);
  }

  // Register a middleware function with the 'post' method
  post() {
    this._register('post', arguments);
  }

  // Add the middleware function to the route
  _register(method, args) {
    if (typeof args[0] === 'string') {
      this.routes.push({
        path: args[0],
        middleware: slice.call(args, 1),
        method: method,
      });
    } else {
      this.routes.push({
        path: '/',
        middleware: slice.call(args),
        method: method,
      });
    }
  }

  // Trigger the middleware functions in the final queue
  _trigger(req, res, jobQueue) {
    const next = () => {
      const middleware = jobQueue.shift();
      if (middleware) {
        middleware(req, res, next);
      }
    };
    next();
  }

  // Handle incoming requests by finding the matching middleware and triggering them
  _handler(req, res) {
    res.json = (data) => {
      res.setHeader('Content-type', 'application/json');
      res.end(JSON.stringify(data));
    };
    const jobQueue = [];
    this.routes.forEach((route) => {
      if (this.match(req, route)) {
        jobQueue.push(...route.middleware);
      }
    });
    this._trigger(req, res, jobQueue);
  }

  // Create and start the HTTP server
  listen() {
    const server = http.createServer((req, res) => {
      this._handler(req, res);
    });
    server.listen(...arguments);
  }
}

module.exports = () => {
  return new Espress();
};
