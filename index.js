const Koa = require('koa')
const app = new Koa()
const config = require('config-lite')(__dirname)
const koaBody = require('koa-body')
const router = require('./routes/router')

const {CustomError, HttpError} = require('./utils/customError')
const format = require('./utils/response')
const constants = require('./utils/constants')
app.use(koaBody())

// 中间件的顺序很重要,顺序不对导致无法正确捕获异常
app.use(async (ctx, next) => {
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
    } else {
      console.error('err', err)
    }
    ctx.body = format(code, {}, msg)
  }
})
app.use(router.routes()).use(router.allowedMethods())

// 404
app.use(async () => {
  throw new HttpError(constants.HTTP_CODE.NOT_FOUND)
})
app.listen(config.port, () => {
  console.log('server is running at http://localhost:3000')
})
