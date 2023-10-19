const db = require('../db/index')
// 导入处理路径的 path 核心模块
const path = require('path')
const {add_article_schema} = require('../schema/article')

exports.addArticle = (req, res) => {
 
    if(!req.file) return res.cc('文章封面不能为空')
    const data = req.body
    const result = add_article_schema.validate(data)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        const articleInfo = {
            // 标题、内容、状态、所属的分类Id
            ...req.body,
            // 文章封面在服务器端的存放路径
            cover_img: path.join(path.join(__dirname, '../uploads'), req.file.filename),
            // 文章发布时间
            pub_date: new Date(),
            // 文章作者的Id
            author_id: req.user.id, // 要求登录之后，必须在token中保存用户的id
          }
   
        // 添加入库
        const sql = 'insert into ev_articles set ?'
        db.query(sql, articleInfo, (err, results) => {
            // 执行 SQL 语句成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('发布文章失败！')

            // 发布文章成功
            res.cc('发布文章成功', 0)
        })
       
    
    }
}