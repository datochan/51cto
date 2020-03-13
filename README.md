# 51cto

51cto's Video Downloader

---

只能下载免费或者已经购买的视频。
需要手工填写cookie以及要下载的课程id。
下载的内容都是零散的ts文件，自己手工用cat命令合并即可, 例如:

```
cat 0.ts 1.ts 2.ts ... n.ts > ../{title}.ts
```