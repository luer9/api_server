const db = require('../db/index')
const {add_cate_schema, del_cate_schema, get_cate_schema, update_cate_schema} = require('../schema/artcate')
exports.getArticleCates = (req, res) => {
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc'
    db.query(sql, (err, results) => {
        // console.log(results)
        if(err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表成功!',
            date: results
        })
    })
    // res.send('ok')
}

exports.addArticleCate = (req, res) => {

    const cateInfo = req.body
    // console.log(userinfo)
    const result = add_cate_schema.validate(cateInfo)
    // console.log(result)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        // 查重
        const sql = 'select * from ev_article_cate where name = ? or alias = ?'
        db.query(sql, [cateInfo.name, cateInfo.alias], (err, results) => {
            if(err) return res.cc(err)
            if(results.length === 2) 
                return res.cc('分类名称与别名被占用')
            if(results.length === 1 && results[0].name === cateInfo.name) 
                return res.cc('分类名称被占用')
            if(results.length === 1 && results[0].alias === cateInfo.alias) 
                return res.cc('分类别名被占用') 

            // 新增文章分类 
            const insertSQL = 'insert into ev_article_cate set ? '
            db.query(insertSQL, cateInfo, (err, results) => {
                if(err) return res.cc(err)
                if(results.affectedRows !== 1) return res.cc('新增文章分类失败!')
                res.cc('新增文章分类成功!', 0)
            })
        })
        // res.send('ok')
    }
}

exports.delCateById = (req, res) => {
    const data = req.params
    // console.log(id)
    const result = del_cate_schema.validate(data)
    // console.log(result)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
        db.query(sql, data.id, (err, results) => {
            if(results.affectedRows !== 1) return res.cc('删除文章分类失败!')
            res.cc('删除文章分类成功!', 0)
        })
        // res.send('ok')
    }
}

exports.getCateById = (req, res) => {
    const data = req.params
    // console.log(id)
    const result = get_cate_schema.validate(data)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
       const sql = 'select * from ev_article_cate where id = ?'
       db.query(sql, data.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('获取文章分类数据失败!')
        res.send({
            status: 0,
            message: '获取文章分类数据成功!',
            data: results[0]
        })
       })
    }
}

exports.updateCateById = (req, res) => {
 
    const data = req.body
    const result = update_cate_schema.validate(data)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        // 查重
        const sql = 'select * from ev_article_cate where id != ? and (name = ? or alias = ?)'
        db.query(sql, [data.id, data.name, data.alias], (err, results) => {
            console.log(results)
            if(err) return res.cc(err)
            if(results.length === 2) return res.cc('分类名称和别名都被占用')
            if(results.length === 1 && results[0].name === data.name)
                return res.cc('分类名称被占用')
            if(results.length === 1 && results[0].alias === data.alias)
                return res.cc('分类别名被占用')
            
            const updateSQL = 'update ev_article_cate set ? where id = ?'
            db.query(updateSQL, [data, data.id], (err, results) => {
                if(err) return res.cc(err)
                if(results.affectedRows !== 1) 
                    return res.cc('更新文章分类失败!')
                res.cc('更新文章分类成功!', 0)
            })
        })
        
       
    }
}