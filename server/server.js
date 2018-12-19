
const Koa = require('koa');
const Logger = require('koa-logger');
const Bodyparser = require('koa-bodyparser');

const constant = require('./constants/constant.js');
const route = require('./route.js');

const SERVER_PORT = constant.SERVER_PORT;
const app = new Koa();

app.use(Logger());
app.use(Bodyparser({
    onerror: (err, ctx) => {
      ctx.throw('Error parsing the body information', 422);
    }
}));
app.use(route.routes());

app.listen(SERVER_PORT);
console.log("server start at http://localhost:"+SERVER_PORT);