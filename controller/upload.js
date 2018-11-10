/**
 * 获取七牛云上传token
 */
import {
  request,
  summary,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
const {
  CustomError
} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')
const { getToken } = require('../utils/qiniu.js')

const QiNiuTag = tags(['七牛云'])
export default class Upload {
  @request('post', '/upload/getUploadToken')
  @summary('获取七牛云上传token')
  @QiNiuTag
  static getUploadToken (ctx, next) {
    try {
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {token: getToken()}, '获取七牛云上传token成功！')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
