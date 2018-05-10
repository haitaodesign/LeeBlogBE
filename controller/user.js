const User = require('../models/user')
const md5 = require('js-md5')
const {CustomError} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')
module.exports = {
  async add (ctx, next) {
    try {
      // 解析参数
      const {username, password, email, avatar} = ctx.request.body
      // 校验参数
      ctx.checkBody('username').notEmpty().len(3, 20)
      ctx.checkBody('password').notEmpty().len(6, 18)
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      let user = {
        username,
        password: md5(password),
        email,
        avatar
      }
      // 写入数据库，数据层交互可以分service层
      await User.create(user).exec()
      // 数据响应
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '用户添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  },
  async update (ctx) {
    // 查询当前数据是否存在
    // 用户名是否重复
    // 存在，则修改，否则，提示该数据不存在
    // const {_id} = ctx.request.body
  }
}
