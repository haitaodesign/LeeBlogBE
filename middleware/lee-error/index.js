import {CustomError, HttpError} from '../../utils/customError'
const format = require('../../utils/response')
export default () => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      let code = 500
      let msg = 'unknown error'
      if (err instanceof CustomError || err instanceof HttpError) {
        const res = err.getCodeMsg()
        ctx.status = err instanceof HttpError ? res.code : 200
        code = res.code
        msg = res.msg
      } else if (err.status === 401) {
        ctx.status = 401
        code = '-1'
        msg = 'unauthorized'
      } else {
        console.error('err', err)
      }
      ctx.body = format(code, {}, msg)
    }
  }
}
