/**
 * 用户管理
 */
import {
  request,
  summary,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
import md5 from 'js-md5'
import jsonwebtoken from 'jsonwebtoken'
const User = require('../models/user')
const {
  CustomError
} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')

const testTag = tags(['用户管理'])
const userSchema = {
  _id: {
    type: 'string',
    descripttion: '唯一id'
  },
  username: {
    type: 'string',
    require: true,
    descripttion: '用户名'
  },
  password: {
    type: 'string',
    require: true,
    descripttion: '密码'
  },
  email: {
    type: 'string',
    descripttion: '电子邮箱'
  },
  avatar: {
    type: 'string',
    descripttion: '头像，存储图片地址'
  }
}

let UserPageSchema = {
  current: {
    type: 'number',
    require: true,
    default: 1
  },
  pageSize: {
    type: 'number',
    require: true,
    default: 10
  }
}

let LoginSchema = {
  username: {
    type: 'string',
    require: true,
    descripttion: '用户名',
    example: 'admin'
  },
  password: {
    type: 'string',
    require: true,
    descripttion: '密码',
    example: '123456'
  }
}

export default class UserController {
  @request('post', '/user/add')
  @summary('添加一个用户')
  @testTag
  @body(userSchema)
  static async add (ctx, next) {
    try {
      // 解析参数
      const {
        username,
        email,
        avatar
      } = ctx.request.body
      // 校验参数
      ctx.checkBody('username').notEmpty().len(3, 20)
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      let user = {
        username,
        password: md5('123456'),
        email,
        avatar
      }
      // 写入数据库，数据层交互可以分service层
      await User.create(user)
      // 数据响应
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '用户添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('delete', '/user/delete/{_id}')
  @summary('删除一个用户')
  @testTag
  @path({
    _id: {type: 'string', require: true, descripttion: '唯一_id'}
  })
  static async delete (ctx, next) {
    try {
      const {_id} = ctx.params
      ctx.checkParams('_id').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      await User.deleteOne({_id})
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '删除用户成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/user/update')
  @summary('修改一个用户')
  @testTag
  @body(userSchema)
  static async update (ctx, next) {
    try {
      const data = ctx.request.body
      const {_id} = data
      console.log('_id', _id)
      const curUser = await User.findById(_id)
      console.log(curUser)
      const getUserToId = curUser._id
      console.log(_id === getUserToId.toString())
      if (_id === getUserToId.toString()) {
        await User.update({_id: getUserToId}, {$set: data})
        ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '修改用户成功')
      } else {
        ctx.body = response(constants.CUSTOM_CODE.ERROR, {}, '修改用户失败')
      }
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/users')
  @summary('获取用户列表')
  @testTag
  @body(UserPageSchema)
  static async getUserList (ctx, next) {
    try {
      const {pageSize, current} = ctx.request.body
      const users = await User.find().skip(pageSize * (current - 1)).limit(parseInt(pageSize)).sort({_id: -1})
      const all = await User.find()
      const page = {
        current,
        pageSize,
        total: all.length
      }
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, users, '获取用户列表成功', page)
    } catch (error) {
      console.log(error)
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/login')
  @summary('登录')
  @testTag
  @body(LoginSchema)
  static async login (ctx, next) {
    try {
      const data = ctx.request.body
      ctx.checkBody('username').notEmpty().len(3, 20)
      ctx.checkBody('password').notEmpty().len(6, 18)
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      const {username, password} = data
      const user = await User.findOne({username})
      if (user !== null && md5(password) === user.password) {
        // 生成token
        const secret = 'leehaitao'
        const token = jsonwebtoken.sign({
          data: {
            _id: user._id,
            username
          },
          exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, secret)
        ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {token}, '登录成功')
      } else {
        ctx.body = response(constants.CUSTOM_CODE.ERROR, {}, '用户名或密码错误')
      }
    } catch (error) {
      console.log(error)
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
