
const Joi = require('@hapi/joi')
// var Joi = expressJoi.Joi;
// 定义验证规则
// const userSchema = Joi.object({
//         username: Joi.string().trim().alphanum().min(1).max(10).required(),
//         password: Joi.string().trim().required()
//     })
const username = Joi.string().min(3).max(30).pattern(/^[a-zA-Z' ]{3,20}$/).required().messages({
    'string.pattern.base': `Your name can only contain lower and uppercase letters and apostrophes`,
    'string.empty': `Name cannot be an empty field`,
    'string.min': `Name should have a minimum length of {#limit}`,
    'string.max': `Name should have a maximum length of {#limit}`,
  
  });

const password = Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]/).required().messages({
    'string.pattern.base': `Password can only contain upper case and lower case characters and numbers`,
    'string.empty': `Password cannot be an empty field`,
    'string.min': `Password should have a minimum length of {#limit}`,
    'string.max': `Password should have a maximum length of {#limit}`,
  
});

const email = Joi.string().email({ minDomainSegments: 2}).min(8).max(30).required().messages({
    'string.email': `Not a Valid E-mail, valid emails are of the form name@domain.tld `,
    'string.empty': `E-mail cannot be an empty field`,
    'string.min': `E-mail should have a minimum length of {#limit}`,
    'string.max': `E-mail should have a maximum length of {#limit}`,
  
});

const id = Joi.number().min(1).required()
const nickname = Joi.string().required()
// dataUri() 字符串数据
// data:image/png;base64,askdhashdaklh=
const avater = Joi.string().dataUri().required()
 
exports.reg_login_schema = Joi.object({username, password})
exports.update_userinfo_schema = Joi.object({id, nickname, email})
exports.update_password_schema = Joi.object({
    oldPwd: password,
    newPwd: Joi.not(Joi.ref('oldPwd')).concat(password) // concat 合并规则
})

exports.update_avator_schema = Joi.object({avater})