// 用户路由处理函数
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const {reg_login_schema} = require('../schema/user')


// 注册
// 检验表单数据是否合法、用户名是否被占用、对密码进行加密、插入新用户
exports.registerFun = (req, res) => {
 
    const userinfo = req.body
    // 合法 通过 joi 实现
    // 优化表达数据验证
    // joi 定义验证规则 
    // express-joi 中间件，实现自动对表单数据进行验证 【是我不会用吗？一直说模式不对】
    // if(!userinfo.username || !userinfo.password) {
    //     return res.cc('用户名或密码不能为空!')
    //     // return res.send({ status: 1, message: '用户名或密码不能为空!'})
    // }
    const result = reg_login_schema.validate(userinfo)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        // 占用
        const sql = 'select * from ev_users where username = ?'
        db.query(sql, [userinfo.username], (err, results) => {
            if(err) return res.cc(err)
            // {return res.send({status: 1, message: err.message})}
            // 用户名被占用
            if(results.length > 0) {
                return res.cc('用户名被占用，请更换其他用户名!')
                // return res.send({status: 1, message: '用户名被占用，请更换其他用户名!'})
            }
            // 用户名可用, 对密码加密 (bcryptjs)
            userinfo.password = bcrypt.hashSync(userinfo.password, 10) // 第二个参数：随机盐的长度
            // 插入
            const insertSQL = 'INSERT INTO ev_users set ?'
            db.query(insertSQL, {username: userinfo.username, password: userinfo.password}, (err, results) => {
                if(err) return res.cc(err)
                // {return res.send( {status: 1, message: err.message})}
                if(results.affectedRows !== 1) {
                    return res.cc('注册用户失败，请稍后再试!')
                    // return res.send( {status: 1, message: '注册用户失败，请稍后再试!'})
                }
                res.cc('注册成功!', 0)
                // res.send({status: 0, message: '注册成功!'})
            })
        })
    }
    

}
// 登陆
exports.loginFun = (req, res) => {
    const userinfo = req.body
    const sql = 'select * from ev_users where username = ?'
    db.query(sql, userinfo.username, (err, results) => {
       
        if(err) return res.cc(err)
        // 执行sql语句成功，但是查询到的数据条数不等于1
        if(results.length !== 1) {
            return res.cc('登陆失败!')
        }
       const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
       if(!compareResult) {
        return res.cc('登陆失败!')
       }
       // 在服务器端生成 token 字符串 [要剔除密码和头像]
       // 快速剔除 ---> 通过es6的高级语法
       const user = {...results[0], password: '', user_pic: ''}
    
       // 生成token
       const tokenStr = jwt.sign(user, config.jwtSecretKey, {
         expiresIn: config.expiresIn
       })
       res.send({
        status: 0,
        message: '登陆成功!',
        token: 'Bearer ' + tokenStr
       })
    })
}