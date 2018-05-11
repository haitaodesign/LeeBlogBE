import { request, summary, query, path, body, tags } from 'koa-swagger-decorator'
import md5 from 'js-md5'
const User = require('../models/user')
const {CustomError} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')

const testTag = tags(['test'])
const userSchema = {
  username:{type:'string',require:true,descripttion:'用户名'},
    password:{type:'string',require:true,descripttion:'密码'},
    email:{type:'string',descripttion:'电子邮箱'},
    avatar:{type:'string',descripttion:'头像，存储图片地址'}
};

export default class UserController {
  @request('post','/user/add')
  @summary('添加一个用户')
  @testTag
  @body(userSchema)
  static async add (ctx, next) {
    try {
      // 解析参数
      console.log(ctx.request.body)
      const {username, password, email, avatar} = ctx.request.body
      // 校验参数
      ctx.checkBody('username').notEmpty().len(3, 20)
      ctx.checkBody('password').notEmpty().len(6, 18)
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      let user = {
        username,
        password: md5(password),
        email,
        avatar
      }
      // 写入数据库，数据层交互可以分service层
      await User.create(user).exec()
      // 数据响应
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '用户添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
