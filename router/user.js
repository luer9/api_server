// 用户的路由模块
//    抽离路由模块的处理函数 于 router_handler
const express = require('express')
const router = express.Router()


// 导入用户处理函数模块
const userHandler = require('../router_handler/user')
// 导入验证表单数据的中间件 试了好多 第三方 都没用 。。。。服了 （自己在 handler 里面写）
 
// 导入表单数据验证规则
// const {reg_login_schema} = require('../schema/user')

// 快速点击 限制
const { registerLimiter, loginLimiter } = require("../utils/rateLimiter");

// 注册新用户
// router.post('/register', (req, res) => {
//     res.send('register ok!')
// })
router.post('/register', registerLimiter, userHandler.registerFun)

// 登陆
router.post('/login', loginLimiter, userHandler.loginFun)

module.exports = router

