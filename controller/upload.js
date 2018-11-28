/**
 * 获取七牛云上传token
 */
import {
  request,
  summary,
  path,
  body,
  tags,
  formData,
  middlewares
} from 'koa-swagger-decorator'
import UploadQiNiu from '../utils/upload.js'
const cdnConfig = require('config-lite')(__dirname)
const { imgDomain } = cdnConfig.qiniu
const {
  CustomError
} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')
const QiNiuTag = tags(['七牛云'])
export default class Upload {
  @request('post', '/upload')
  @summary('七牛云图片上传接口代理')
  @QiNiuTag
  @formData({
    file: {
      type: 'file',
      required: 'true',
      description: 'upload file, get url'
    }
  })
  static async upload (ctx, next) {
    try {
      // 同步图片资源到七牛云
      const path = ctx.request.body.files.file.path
      const res = await UploadQiNiu.uploadQiNiu('public/upload/' + ctx.uploadpath.file, path)
      const url = imgDomain + res.key
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {url}, '获取七牛云上传token成功！')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
