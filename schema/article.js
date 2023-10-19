const Joi = require('@hapi/joi')
// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = Joi.string().required()
const cate_id = Joi.number().integer().min(1).required()
const content = Joi.string().required().allow('')
const state = Joi.string().valid('已发布', '草稿').required()
exports.add_article_schema = Joi.object({title, cate_id, content, state})