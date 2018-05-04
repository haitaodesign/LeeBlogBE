const User = require('../models/user')
const {ERROR, SUCCESS} = require('../lib/util')
const md5 = require('js-md5')
const {CustomError, HttpError} = require('../utils/customError')
const constants = require('../utils/constants')
module.exports = {
  async add (ctx, next) {
    try {
      // 解析参数
      const {username, password, email, avatar} = ctx.request.body
      // 校验参数
      if (!username.length) {
        throw new Error('用户名不能为空！')
      }
      if (!password.length) {
        throw new Error('密码不能为空！')
      }
      let user = {
        username,
        password: md5(password),
        email,
        avatar
      }
      // 写入数据库，数据层交互可以分service层
      await User.create(user)
      // 数据响应
      ctx.body = Object.assign(SUCCESS, {
        message: '用户添加成功！'
      })
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.INTERNAL_SERVER_ERROR, error.message)
    }
  },
  async update (ctx) {
    // 查询当前数据是否存在
    // 用户名是否重复
    // 存在，则修改，否则，提示该数据不存在
    // const {_id} = ctx.request.body
  }
}
