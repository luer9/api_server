
const Joi = require('@hapi/joi')

const name = Joi.string().required()
const alias = Joi.string().alphanum().required()

const id = Joi.number().integer().min(1).required()



exports.add_cate_schema = Joi.object({name, alias})
exports.del_cate_schema = Joi.object({id})
exports.get_cate_schema = Joi.object({id})
exports.update_cate_schema = Joi.object({id, name, alias})
