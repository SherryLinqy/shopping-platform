/*
成功的响应
*/ 
function successRes(result = '', detail, callback) {
    let callbackDate = {
        result: result,
        status: {
            code: 1,
            msg: 'Success',
            detail: detail || "成功"
        }
    };
    if(callback){
        return `${callback}(${JSON.stringify(callbackDate)})`;
    }else{
        return callbackDate;
    }
}
/*
出错的响应
*/ 
function errorRes(result = '', detail, code = 0, callback) {
    let callbackDate = {
        result: result,
        status: {
            code: code,
            msg: "Fail",
            detail: detail
        }
    };
    if(callback){
        return `${callback}(${JSON.stringify(callbackDate)})`;
    }else{
        return callbackDate;
    }
}

module.exports = {
    successRes: successRes,
    errorRes: errorRes
}