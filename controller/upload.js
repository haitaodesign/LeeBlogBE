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
      const { key } = await UploadQiNiu.uploadQiNiu('public/upload/' + ctx.uploadpath.file, path)
      const url = imgDomain + key
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {url, key}, '获取七牛云上传token成功！')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/delete')
  @summary('七牛云图片删除接口代理')
  @QiNiuTag
  @body({
    key: {
      type: 'string',
      require: true,
      description: '图片路径'
    }
  })
  static async delete (ctx, next) {
    try {
      const {key} = ctx.request.body
      const res = await UploadQiNiu.deleteQiNiu(key)
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, res, '删除图片成功！')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
