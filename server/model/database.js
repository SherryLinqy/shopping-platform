
var fs = require('fs');

function Database(filename = "data.json"){
    this.tables = {};
    this.template = {};
    var that = this;
    //深拷贝
    function deepClone(initalObj) {  
        return JSON.parse(JSON.stringify(initalObj)); 
    }
    //写json文件
    function writJSON(callback=()=>{}){
        var str = JSON.stringify(that.tables);
        fs.writeFile(filename, str, function(err,data){
            if(err){
                callback(err);
                return;
            }
            callback(err, {"successInf":"存入数据库成功"});
        })
    }
    //新建表
    Database.prototype.addTable = function (name, template){
        if(typeof name !== 'string'|| name.length===0){
            return false;
        }
        template.id = this.template.id||0;
        this.template = deepClone(template);
        this.tables[name] = { "data": this.tables[name]?(this.tables[name].data||[]):[]};
        return true;
    }
    //数据库增加操作
    Database.prototype.add = function (table, param, callback=()=>{}){
        if(typeof param.id !== 'undefined'){
            console.error("error：添加数据中的id属性不可修改！");
            return;
        }
        this.template.id = this.tables[table].data.length;
        var obj = deepClone(this.template);
        for(var o in param){
            if(typeof obj[o] !== 'undefined'){
                obj[o] = param[o];
            }
        }
        this.tables[table].data.push(obj);
        writJSON(function(err, data){
            if(err){
                callback(err);
                return;
            }
            callback(err, data);
        });
    }
    //数据库删除操作
    Database.prototype.del = function (table, param, callback=()=>{}){
        this.search(table, param, function(err, data){
            if(data.length===0){
                callback({"errorInf":"未检索到匹配项"});
                return ;
            }
            data.forEach(function(obj, i){
                var array = that.tables[table].data;
                array.splice(i, 1);
            });
            writJSON(function(err, data){
                if(err){
                    callback(err);
                    return;
                }
                callback(null, {"successInf": "删除数据成功"});
            });
        });
    }
    //数据库修改操作
    Database.prototype.update = function (table, param, change, callback=()=>{}){
        this.search(table, param, function(err, data){
            if(data.length===0){
                callback({"errorInf":"未检索到匹配项"});
                return ;
            }
            data.forEach(function(obj, i){
                var databaseObj = that.tables[table].data[obj.id];
                for(var o in change){
                    if(typeof obj[o] != 'undefined'&&o!=="id"){
                        databaseObj[o] = change[o];
                    }
                }
            });
            writJSON(function(err, data){
                if(err){
                    callback(err, {"errorInf": "更新数据失败"});
                    return;
                }
                callback(null, {"successInf": "更新数据成功"});
            });
        });
    }
    //数据库查询操作
    Database.prototype.search = function (table, param, callback=()=>{}){
        var data = this.tables[table].data;
        var result = [];
        data.forEach(function(o, i){
            var sameFlag = true;
            for(var p in param){
                if(param[p] != o[p]){
                    sameFlag = false;
                    break;
                }
            }
            if(sameFlag){
                result.push(deepClone(o));
            }
        });
        callback(null, result);
    }
    //打开数据库
    Database.prototype.startDatabase = function (callback=()=>{}){
        fs.readFile(filename, function(err,data){
            if(err){
                return console.error(err);
            }
            var obj = {};
            if(data.length===0){
                obj = {};
            }else{
                obj = JSON.parse(data);
            }
            that.tables = obj;
            console.log("数据库已开启");
            callback();
        });
    }
}


// var database = new Database('data.json');
// database.startDatabase(function(){
//     var table2 = "compute";
//     var person2 = {
//         "name": "lenovo",
//         "price": 4000,
//         "interface": ["USB", "HDMI"],
//         "size": 16
//     }
    // database.addTable(table2, {
    //     "name": "",
    //     "price": 0,
    //     "interface": [],
    //     "size": 15
    // });

    // database.add(table2, person2, function(err, data){
    //     if(err){
    //         console.error(err);
    //         return;
    //     }
    //     console.log(147, data);
    // });

    // database.search(table2, {"id": 3}, function(err, data){
    //     if(err){
    //         console.error(err);
    //         return;
    //     }
    //     console.log(data);
    // });

    // database.del(table2, {"id": 5}, function(err, data){
    //     if(err){
    //         console.error(err);
    //         return;
    //     }
    //     console.log(data);
    // });
// });

module.exports = Database;