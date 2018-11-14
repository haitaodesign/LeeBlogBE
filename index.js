import Koa from 'koa'
import router from './routes/index'
import ip from 'ip'
import koaBody from 'koa-body'
import LeeError from './middleware/lee-error/index'
import leeJwt from './middleware/lee-jwt/index'
import Upload from './utils/upload.js'
const app = new Koa()
const config = require('config-lite')(__dirname)
require('koa-validate')(app)
const koaJwt = require('koa-jwt')
const koaCors = require('koa2-cors')
const {HttpError} = require('./utils/customError')
const constants = require('./utils/constants')
const leeLog = require('./middleware/lee-log/index')
const path = require('path')
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
    uploadDir: 'public/',
    keepExtensions: true,
    onFileBegin: (name, file) => {
      const ext = Upload.getFileNameExtension(file.name)
      const dirName = Upload.getUploadDirName()
      const dir = path.join(__dirname, `public/upload/${dirName}`)
      Upload.checkDirExist(dir)
      const fileName = Upload.getUploadFileName(ext)
      file.path = `${dir}/${fileName}`
      app.context.uploadpath = app.context.uploadpath ? app.context.uploadpath : {}
      app.context.uploadpath[name] = `${dirName}/${fileName}`
    }
  }
}))
// 中间件的顺序很重要,顺序不对导致无法正确捕获异常
app.use(LeeError())
app.use(leeJwt())
// 解析token中间件，获取信息以及设置失效时间
const secret = 'leehaitao'
app.use(koaJwt({secret}).unless({
  path: [/\/api\/swagger-html/, /\/api\/swagger-json/, /\/api\/login/, /\/api\/articles/, /\/api\/article\/getArticleById/]
}))
app.use(router.routes())
  .use(router.allowedMethods())

// 404
app.use(async () => {
  throw new HttpError(constants.HTTP_CODE.NOT_FOUND)
})
app.listen(config.port, () => {
  console.log('server is running at http://localhost:3000/api/swagger-html')
})
