/**
 * 文章管理
 */
import {
  request,
  summary,
  query,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
import Article from '../models/article'
const {
  CustomError
} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')

const ArticleTag = tags(['文章管理'])

const articleSchema = {
  _id: {
    type: 'string',
    descripttion: '唯一id'
  },
  tiltle: {
    type: 'string',
    require: true,
    descripttion: '文章标题'
  },
  content: {
    type: 'string',
    require: true,
    descripttion: '内容，markdown格式'
  },
  isPublish: {
    type: 'boolean',
    require: true,
    descripttion: '是否发布'
  },
  categoryId: {
    type: 'string',
    require: true,
    descripttion: '目录id'
  },
  labelId: {
    type: 'string',
    require: true,
    descripttion: '标签id,多个，使用逗号拼接'
  }
}

export default class ArticleController {
  @request('post','/article/add')
  @summary('新增一篇文章')
  @ArticleTag
  @body(articleSchema)
  static async add (ctx, next) {
    try {
      const data = ctx.request.body
      ctx.checkBody('title').notEmpty()
      ctx.checkBody('content').notEmpty()
      ctx.checkBody('isPublish').notEmpty()
      ctx.checkBody('categoryId').notEmpty()
      ctx.checkBody('labelId').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      // user_id 通过解析token拿到
      let article = Object.assign(data,{user_id:'2'})
      await Article.create(article).exec()
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '文章添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  static async delete (ctx,next){
    //通过user_id,判断该用户是否拥有此文章的权限，管理员无需进行判断
  }
}
