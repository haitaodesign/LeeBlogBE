import md5 from 'js-md5'
const User = require('../models/user')
class init {
  static async initAdmin () {
    try {
      let user = {
        username: 'admin',
        password: md5('123456'),
        email: '177581@qq.com',
        avatar: 'http://avatar.com'
      }
      await User.create(user).exec()
      console.log('初始化管理员账号成功！')
    } catch (error) {
      console.log(error)
    }
  }
}
init.initAdmin()
