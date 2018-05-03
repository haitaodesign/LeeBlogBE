const User = require('../models/user')
module.exports = {
  async add (ctx, next) {
    // 解析参数
    try {
      const {username, password, email, avatar} = ctx.request.body
      console.log(username)
      // 校验参数
      if (!username.length) {
        throw new Error('用户名不能为空！')
      }
      if (!password.length) {
        throw new Error('密码不能为空！')
      }
      let user = {
        username,
        password,
        email,
        avatar
      }
      // 写入数据库，数据层交互可以分service层
      await User.create(user)
      // 数据响应
      ctx.body = {
        code: 0,
        data: {},
        message: '用户添加成功！'
      }
    } catch (error) {
      ctx.body = {
        code: 1,
        data: {},
        message: error.message
      }
    }
  }
}
