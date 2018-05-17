
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
export default () => {
  return async function (ctx, next) {
    try {
      if (ctx.header.authorization) {
        const token = ctx.header.authorization.replace(/Bearer/, '').trim() // 获取jwt
        let payload
        try {
          payload = await verify(token, 'leehaitao') // 解密payload，获取用户名和ID
          console.log(payload)
          ctx.state.user = {
            username: payload.username,
            _id: payload._id
          }
        } catch (err) {
          console.log('token verify fail: ', err)
        }
      }

      await next()
    } catch (err) {
      console.log(err)
      if (err.status === 401) {
        ctx.body = {
          code: -1,
          message: '认证失败'
        }
      } else {
        err.status = 404
        ctx.body = '404'
        console.log('不服就是怼：', err)
      }
    }
  }
}
