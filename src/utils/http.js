var rp = require('request-promise');

/**
 * 以指定的方式请求网址
 * @param {string} url 
 * @param {string} method GET|POST|PUT|DELETE ...
 * @param {object} headers 
 * @param {object} data 
 * @notice 暂不支持文件上传，文件上传参考upload接口
 */
async function request(url, method="GET", headers={}, type=null, data=null, json=false){
    var options = {
        method: method,
        uri: url,
        headers: headers
    }

    if (json && data !== null) {
        options.data = data;
        options.json = json;
    } else if (!json && data !== null) {
        options.form = data
    }
    
    if (type !== null) {
        options.encoding = type;
    }
    return new Promise(function(resolve){
        rp(options)
            .then(function(resp){resolve(resp);})
            .catch(function(resp){resolve(resp);});
    });
}

/**
 * 上传文件
 * @param {*} url 
 * @param {*} headers 
 * @param {*} formdata 上传文件的表单中若有别的字段填写到这里，例如: {name: 'Jenn'} // Like <input type="text" name="name">
 * @param {*} filename 文件名
 * @param {*} filetype 文件类型: image/jpg， image/png ...
 * @param {*} filepath 文件在本地的路径
 */
async function upload(url, headers={}, formdata={}, filename, filetype, filepath) {
    var options = {
        method: 'POST',
        uri: url,
        headers: headers,
        formData: formdata
    }

    options.formData.file = {
        value: fs.createReadStream(filepath),
        options: {
            filename: filename,
            contentType: filetype
        }
    }

    return new Promise(function(resolve){
        rp(options).then(function(){resolve(true);})
            .catch(function(){resolve(false);});
    });
}


module.exports = {request: request, upload: upload};