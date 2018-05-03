const User = require('../models/user')
const {ERROR, SUCCESS} = require('../lib/util')
const md5 = require('js-md5')
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
      ctx.body = Object.assign(ERROR, {
        message: error.message
      })
    }
  }
}
