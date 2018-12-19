
const Koa = require('koa');
const Logger = require('koa-logger');
const Bodyparser = require('koa-bodyparser');

const constant = require('./constants/constant.js');
const route = require('./route.js');
var cors = require('koa2-cors');

const SERVER_PORT = constant.SERVER_PORT;
const app = new Koa();

app.use(Logger());
app.use(Bodyparser({
    onerror: (err, ctx) => {
      ctx.throw('Error parsing the body information', 422);
    }
}));
app.use(route.routes());
app.use(cors({
  origin: function (ctx) {
      return "*"; // 允许来自所有域名请求
    //return 'http://localhost:8094'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Date'],
  maxAge: 100,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Custom-Header', 'anonymous'],
}));

app.listen(SERVER_PORT);
console.log("server start at http://localhost:"+SERVER_PORT);