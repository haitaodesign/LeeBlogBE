import Koa from 'koa'
import router from './routes/index'
import ip from 'ip'
import koaBody from 'koa-body'
import LeeError from './middleware/lee-error/index'
const app = new Koa()
const config = require('config-lite')(__dirname)
require('koa-validate')(app)
// const koaJwt = require('koa-jwt')
const koaCors = require('koa2-cors')
const {HttpError} = require('./utils/customError')
const constants = require('./utils/constants')
const leeLog = require('./middleware/lee-log/index')
app.use(leeLog({
  env: app.env,
  projectName: 'leeblogfe',
  appLogLevel: 'debug',
  dir: 'logs',
  serverIp: ip.address()
}))
app.use(koaCors())
app.use(koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true
  }
}))

// 中间件的顺序很重要,顺序不对导致无法正确捕获异常
app.use(LeeError())
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
