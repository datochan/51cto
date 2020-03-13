var fs = require("fs");

/**
 * 判断指定的路径是否存在
 * @param _path
 * @returns {*}
 */
function exists(_path){
    return fs.existsSync(_path);
}

function isFile(_path){
    return exists(_path) && fs.statSync(_path).isFile();
}

function makedir(_path) {
    return fs.mkdirSync(_path)
}

module.exports = {isFile: isFile, exists: exists, makedir: makedir};