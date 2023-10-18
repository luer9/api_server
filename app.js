const express = require('express')
const cors = require('cors')
const config = require('./config')
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userinfo')
// const expressJoi = require('express-joi')
const expressJWT = require('express-jwt')
const Joi = require('joi')
const app = express()



// 配置跨域中间件
app.use(cors())
// 配置解析表单数据的中间件，只能解析 application/x-www-form-urlencoded格式的表单数据
app.use(express.urlencoded({extended: false}))

// 优化/封装res.send()函数 (在路由之前)
app.use((req, res, next) => {
    // 手动为 res对象挂载一个 cc函数
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message: err
        })
    }
    next()
})

// 配置 token中间件(路由之前), unless指定哪些接口不需要token身份验证
app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api\//]}))

// 配置用户路径模块
app.use('/api', userRouter)
// 用户信息路由
app.use('/my', userInfoRouter)

// 错误中间件
app.use((err, req, res, next) => {
    // 数据验证失败
    if( err instanceof Joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if( err.name === 'UnauthorizedError') return res.cc('身份认证失败!')
    // 未知错误
    res.cc(err)
    next()
})

app.listen(3007, () => {
    console.log('express server is running on http://127.0.0.1:3007')
})