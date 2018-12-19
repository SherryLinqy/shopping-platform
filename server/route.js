const Router = require("koa-router");

const action = require("./controllers/action.js");

const { index, add, del, update, search } = action;

//路由
const route = Router();

//首页
route.get('/', index);

//add
route.get('/add', add);

//del
route.get('/del', del);

//update
route.get('/update', update);

//search
route.get('/search', search);


module.exports = route;