'use strict';

//import { successRes, errorRes } from '../util/res.js'
const Res = require('../util/res.js');
var { successRes, errorRes } = Res;
const { USER_TABLE } = require('../constants/constant.js');

const Database = require('../model/contactDB.js');
const DB = new Database('./server/model/data.json');
DB.startDatabase(function(){
    DB.addTable(USER_TABLE, {
        "username": "",
        "password": ""
    });
});

//首页
async function index(ctx, next){ 
  try{
      ctx.response.type = 'text/html';
      let res = '<h1>Hello world!</h1>';
      return ctx.body = res;
  }catch(err){
      return ctx.body = errorRes('', `${err}`)
  }
}

//添加
async function add(ctx, next){
  try{
    let param = ctx.request.query;
    var person = {
      username: param.username,
      password: param.password
    }
    const result = await DB.add(USER_TABLE, person);
    const response = result?successRes('添加数据成功'):errorRes('添加数据失败');
    console.log("add result: ",response);
    return ctx.body = response;
  }catch(err){
    return ctx.body = errorRes('', `${err}`);
  } 
}
//删除
async function del(ctx, next){
  try{
    const param = ctx.request.query;
    const result = await DB.del(USER_TABLE, param);
    const response = result?successRes('删除数据成功'):errorRes('删除失败，未检索到数据');
    console.log("delete result: ", response);
    return ctx.body = response;
  }catch(err){
    return ctx.body = errorRes('', `${err}`);
  } 
}
//修改
async function update(){
  try{
    const query = ctx.request.query;
    const param = {username: query.username};
    const change = {password: query.password};
    const result = await DB.update(USER_TABLE, param, change);
    const response = result?successRes('修改数据成功'):errorRes('修改数据失败');
    console.log("update result: ", response);
    return ctx.body = response;
  }catch(err){
    return ctx.body = errorRes('', `${err}`)
  }
}
//搜索
async function search(ctx, next){
  try{
    let param = ctx.request.query;
    const result = await DB.search(USER_TABLE, param);
    const response = result.length>0?successRes(result):errorRes('搜索数据失败');
    console.log("search result: ", result);
    ctx.body = response;
    return result;
  }catch(err){
    console.log(err);
    return ctx.body = errorRes('', `${err}`)
  }
}

module.exports = {
  index: index,
  add: add,
  del: del,
  update: update,
  search: search
};
