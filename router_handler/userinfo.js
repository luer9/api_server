const db = require('../db/index')
const bcrypt = require('bcryptjs')
const {update_userinfo_schema, update_password_schema, update_avator_schema } = require('../schema/user')
// 得到用户信息
exports.getUserInfo = (req, res) => {
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id = ?'
    // 只要身份认证成功就会挂载user对象 id直接使用
    db.query(sql, req.user.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) {
            return res.cc('获取用户信息失败!')
        }
        res.send({
            status: 0,
            message: '获取用户基本信息成功',
            data: results[0]
        })
    })
 
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
    const userinfo = req.body
    // console.log(userinfo)
    const result = update_userinfo_schema.validate(userinfo)
    // console.log(result)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        const sql = 'update ev_users set ? where id = ?'
        db.query(sql, [req.body, req.body.id], (err, results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('修改用户信息失败')
            return res.cc('修改用户信息成功!', 0)
        })
  
    }
}

// 重置密码 (oldpwd, newpwd) 用户是否存在，旧密码是否一致，更新
exports.updatePassword = (req, res) => {
    const userinfo = req.body
    const sql = 'select * from ev_users where id = ?'
    db.query(sql, req.user.id, (err, results) => {
        if(err) return res.cc(err)
        if(results.length !== 1) {
            return res.cc('用户不存在!')
        }
        // 判断旧密码
        const compareResult = bcrypt.compareSync(userinfo.oldPwd, results[0].password)
        if(!compareResult) {
         return res.cc('原密码错误!')
        }else {
            const result = update_password_schema.validate(userinfo)
            if(result.error) {
                return res.cc(result.error, 0)
            }else {
                const updateSQL = 'update ev_users set password = ? where id = ?'
                const newPwd = bcrypt.hashSync(userinfo.newPwd, 10)
                db.query(updateSQL, [newPwd, req.user.id], (err, results) => {
                    if(err) return res.cc(err)
                    if(results.affectedRows !== 1) {
                        return res.cc('更新密码失败')
                    }
                    res.cc('更新密码成功!', 0)
                })
            }
        }
    })
}

exports.updateAvater = (req, res) => {
    const avater = req.body
    console.log(avater)
    const result = update_avator_schema.validate(avater)
    // console.log(result)
    if(result.error) {
        return res.cc(result.error, 0)
    }else {
        // return res.send('ok')
        // 更新
        const sql = 'update ev_users set user_pic = ? where id = ?'
        db.query(sql, [avater.avater, req.user.id], (err, results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('更新头像失败!')
            return res.cc('更新头像成功!', 0)
        })
    }
}