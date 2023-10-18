const express = require('express')
const userinfo_handler = require('../router_handler/userinfo')

const router = express.Router()

// 得到用户信息
router.get('/userInfo', userinfo_handler.getUserInfo)


// 更新用户信息
router.post('/userUpdate', userinfo_handler.updateUserInfo)

// 重置密码
router.post('/updatePwd', userinfo_handler.updatePassword)

// 更新用户头像
router.post('/updateAvater', userinfo_handler.updateAvater)

module.exports = router