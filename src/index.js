var lesson = require("./cto51/lesson");


var headers = {
    // TODO: 使用时在这里填写你下载课程的播放页url
    'referer': 'https://edu.51cto.com/center/course/lesson/index?id=231163',
    // TODO: 使用时在这里填写你个人的Cookie信息
     'cookie': 'www51cto=****************************'

};


function main() {
    // TODO: 指定下载的路径地址
    let filePath = "/Users/datochan/Downloads/51CTO/";
    // TODO: 指定要下载的课程id, 可以到播放页查看url后面的id
    // 如 https://edu.51cto.com/center/course/lesson/index?id=231163
    let lesson_ids = [231163/*, 231164, 231165, ...*/];

    lesson.setHeaders(headers);

    for (let lid of lesson_ids) {
        lesson.download(lid, filePath);
    }
}

main();