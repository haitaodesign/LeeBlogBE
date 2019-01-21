import Koa from 'koa'
import router from './routes/index'
import ip from 'ip'
import koaBody from 'koa-body'
import LeeError from './middleware/lee-error/index'
import leeJwt from './middleware/lee-jwt/index'
import Upload from './utils/upload.js'
const app = new Koa()
require('koa-validate')(app)
const koaJwt = require('koa-jwt')
const koaCors = require('koa2-cors')
const {HttpError} = require('./utils/customError')
const constants = require('./utils/constants')
const leeLog = require('./middleware/lee-log/index')
const path = require('path')
const fs = require('fs')
const ACMClient = require('acm-client').ACMClient
const acm = new ACMClient({
  endpoint: 'acm.aliyun.com', // Available in the ACM console
  namespace: '74287c23-99f8-4dc1-945b-ed3c8eb5b68b', // Available in the ACM console
  accessKey: '9b302fba53004a2f8463989f5dcb0a10', // Available in the ACM console
  secretKey: 'HeMN2SoTlZFpOISd+iVZyAIO5gM=', // Available in the ACM console
  requestTimeout: 6000 // Request timeout, 6s by default
})
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
  path: [/\/api\/swagger-html/, /\/api\/swagger-json/, /\/api\/login/, /\/api\/articles/, /\/api\/article\/getArticleById/, /\/api\/fixer\/latest/]
}))
app.use(router.routes())
  .use(router.allowedMethods())

// 404
app.use(async () => {
  throw new HttpError(constants.HTTP_CODE.NOT_FOUND)
})
// 主动拉取配置
const initAcm = async () => {
  const content = await acm.getConfig('test-acm', 'DEFAULT_GROUP')
  // 写入配置文件
  const file = path.join(__dirname, 'config/default.json')
  fs.writeFile(file, content, (err) => {
    if (err) throw err
    ininApp(JSON.parse(content).app)
  })
}
initAcm()
function ininApp (configb) {
  app.listen(configb.port, () => {
    console.log('server is running at http://localhost:3000/api/swagger-html')
  })
}
