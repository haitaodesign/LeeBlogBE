const Koa = require('koa')
const ip = require('ip')
const app = new Koa()
const config = require('config-lite')(__dirname)
const koaBody = require('koa-body')
require('koa-validate')(app)
const koaJwt = require('koa-jwt')
const koaCors = require('koa2-cors')
const router = require('./routes/router')

const {CustomError, HttpError} = require('./utils/customError')
const format = require('./utils/response')
const constants = require('./utils/constants')

const leeLog = require('./middleware/lee-log/index')
app.use(koaCors())
app.use(leeLog({
  env: app.env,
  projectName: 'leeblogfe',
  appLogLevel: 'debug',
  dir: 'logs',
  serverIp: ip.address()
}))
app.use(koaBody({multipart: true, formidable: {keepExtensions: true}}))

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
    } else if (err.status === 401) {
      ctx.status = 401
      code = '-1'
      msg = 'unauthorized'
    } else {
      console.error('err', err)
    }
    ctx.body = format(code, {}, msg)
  }
})
// const secert = 'leehaitao'
// app.use(koaJwt({secert}))

app.use(router.routes()).use(router.allowedMethods())

// 404
app.use(async () => {
  throw new HttpError(constants.HTTP_CODE.NOT_FOUND)
})
app.listen(config.port, () => {
  console.log('server is running at http://localhost:3000')
})
