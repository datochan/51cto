var fs = require("fs");
var http = require("../utils/http");
var CryptoJS = require("crypto-js");
var file = require("../utils/file")
var cryptox = require("./cryptox");

var headers = {
    'authority': 'edu.51cto.com',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'sec-fetch-dest': 'empty',
    'x-requested-with': 'XMLHttpRequest',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
};

/**
 * 设置http请求的header信息
 * @param {object} _headers
 */
function setHeaders(_headers={}) {
    Object.assign(headers, _headers);
}

/**
 * 获取课程信息
 * @param {*} lid 课程url中的lession_id
 */
async function lesson_info(lid) {
    let sign = CryptoJS.MD5(lid+"eDu_51Cto_siyuanTlw").toString();
    let url =  "https://edu.51cto.com/center/player/play/get-lesson-info?"
                + "type=course&lesson_type=course&sign=" + sign + "&lesson_id=" + lid;

    let content = await http.request(url, "GET", headers);
    if (content instanceof Error) {
        // 如果请求网络错误则抛出异常
        throw content;
    }

    let resp = JSON.parse(content);

    for (let item of resp.dispatch) {
        if (item.name === "hd") {
            // 只下载高清视频
            return {title: resp.lesson_title, url: item.url}
        }
    }

    // 如果没有高清视频，就下载第一个视频
    return {title: resp.lesson_title, url: resp.dispatch[0].url}
}

/**
 * 获取课程解密的秘钥信息
 * @param {*} lid 
 * @param {*} ext_x_key 
 */
async function lesson_key(lid, ext_x_key) {
    // https://edu.51cto.com/center/player/play/get-key?lesson_id=230062&id=220304&type=course&lesson_type=course&isPreview=0&sign=
    // #EXT-X-KEY:METHOD=AES-128,URI="/center/player/play/get-key?lesson_id=230062&id=220304&type=course&lesson_type=course&isPreview=0",IV=0x0123456789abcdef0123456789abcdef
    let sign = CryptoJS.MD5(lid+"eDu_51Cto_siyuanTlw").toString();
    let start = ext_x_key.indexOf("URI=") + 5;
    let end = ext_x_key.indexOf("\",IV=");
    let url = ext_x_key.slice(start, end);
    let resp = await http.request("https://edu.51cto.com" + url + "&sign=" + sign, "GET", headers);
    if (resp instanceof Error) {
        // 如果请求网络错误则抛出异常
        throw resp;
    }
    
    return resp;
}

/**
 * 解密指定的课程内容
 * @param {*} lid 
 * @param {*} key 
 * @param {*} content 
 * @param {*} filePath
 */
function decrypt(lid, key, content, filePath) {
    cryptox.decrypt(content, key, lid, (data) => {
        fs.writeFile(filePath, data, { 'mode': 493, 'encoding': 'binary'}, (err) => {
            if (err) {
                console.error("写入文件发生错误:" + err);
                throw err;
            }
        });
    });
}

/**
 * 下载课程中所有的ts
 * @param {number} lid 
 * @param {string} lpath 要下载到本地哪个目录 
 */
async function download(lid, lpath) {
    try {
        let content = await lesson_info(lid);
        let filePath = lpath + content.title + "/";
        if (file.exists(filePath) ) {
            throw Error("要下载的目录已经存在, 请备份清理后再执行下载.")
        }
        file.makedir(filePath);

        let resp = await http.request(content.url, "GET", headers);
        if (resp instanceof Error) {
            // 如果请求网络错误则抛出异常
            throw resp;
        }
        
        let idx = 0;
        let strKey = "";
        let cnt_list = resp.split("\n");
        for(let line of cnt_list) {
            if (line.startsWith('#EXT-X-KEY')) {
                // 开始去获取秘钥
                strKey = await lesson_key(lid, line);
                continue
            }

            if (line.startsWith('http')) {
                let resp = await http.request(line, "GET", headers, "binary");
                if (resp instanceof Error) {
                    // 如果请求网络错误则抛出异常
                    throw resp;
                }
                let data = new Buffer.from(resp, 'ascii')
                decrypt(lid, strKey, data, filePath+idx+".ts");
                idx ++;
            }

        }

        // 解析文件内容
        // 以课程标题创建文件夹并下载ts的内容到文件夹内
    } catch (error) {
        throw error;
    }
}

module.exports = {download: download, setHeaders: setHeaders};
// download(230062, "/Users/datochan/Documents/Workspace/VSCProjects/51CTO/data/项目经理/");