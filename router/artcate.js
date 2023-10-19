const express = require('express')
const artcate_handler = require('../router_handler/artcate')
const router = express.Router()

// 获取文章分类
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章分类
router.post('/addcates', artcate_handler.addArticleCate)

// 根据 id 删除文章分类
router.get('/deletecate/:id', artcate_handler.delCateById)

// 根据 id 获取文章分类
router.get('/getcate/:id', artcate_handler.getCateById)

// 根据 id 更新文章分类
router.post('/updatecate', artcate_handler.updateCateById)

module.exports = router