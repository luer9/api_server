const express = require('express')
const article_handler = require('../router_handler/article')
const multer = require('multer')
const path = require('path')
const router = express.Router()

// 获取文章分类 [formData] 使用multer解析
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
const upload = multer({dest: path.join(__dirname, '../uploads')})
console.log(path.join(__dirname, '../uploads'))
router.post('/add', upload.single('cover_img'), article_handler.addArticle)


module.exports = router