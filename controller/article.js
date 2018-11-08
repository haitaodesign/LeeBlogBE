/**
 * 文章管理
 */
import {
  request,
  summary,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
import Article from '../models/article'
import Marked from 'marked'
import day from 'dayjs'
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
  title: {
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
  category_id: {
    type: 'string',
    require: true,
    descripttion: '目录id'
  },
  label_id: {
    type: 'array',
    require: true,
    items: {
      type: 'string',
      example: 'tttt'
    },
    descripttion: '标签id,多个，使用逗号拼接'
  }
}

let ArticlePageSchema = {
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

let getArticleById = {
  _id: {
    type: 'string',
    descripttion: '唯一id'
  },
  isEdit: {
    type: 'boolean',
    require: true,
    descripttion: '是否编辑'
  }
}

export default class ArticleController {
  @request('post', '/article/add')
  @summary('新增一篇文章')
  @ArticleTag
  @body(articleSchema)
  static async add (ctx, next) {
    try {
      const { title, content, isPublish, categoryId, labelId } = ctx.request.body
      ctx.checkBody('title').notEmpty()
      ctx.checkBody('content').notEmpty()
      ctx.checkBody('isPublish').notEmpty()
      // ctx.checkBody('category_id').notEmpty()
      // ctx.checkBody('label_id').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      // user_id 通过解析token拿到
      const { _id } = ctx.state.user.data
      let article = {
        title,
        content,
        isPublish: Boolean(isPublish),
        categoryId,
        labelId,
        update_at: day(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        user_id: _id
      }
      await Article.create(article).exec()
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '文章添加成功')
    } catch (error) {
      console.log(error)
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('delete', '/article/delete/{_id}')
  @summary('删除一篇文章')
  @ArticleTag
  @path({
    _id: {type: 'string', require: true, descripttion: '唯一_id'}
  })
  static async delete (ctx, next) {
    try {
      const { _id } = ctx.params
      ctx.checkParams('_id').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }

      await Article.deleteOne({_id}).exec()
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '删除文章成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/article/update')
  @summary('修改一篇文章')
  @ArticleTag
  @body(articleSchema)
  static async update (ctx, next) {
    try {
      const data = ctx.request.body
      const {_id} = data
      const curArticle = await Article.findOne({_id: _id}).exec()
      const getArticleToId = curArticle._id
      if (_id == getArticleToId) {
        const updateAt = day(new Date()).format('YYYY-MM-DD HH:mm:ss')
        data.update_at = updateAt
        await Article.update({_id: getArticleToId}, {$set: data}).exec()
        ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '修改文章成功')
      } else {
        ctx.body = response(constants.CUSTOM_CODE.ERROR, {}, '修改文章失败')
      }
    } catch (error) {
      console.log(error)
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/articles')
  @summary('获取文章列表')
  @ArticleTag
  @body(ArticlePageSchema)
  static async getArticleList (ctx, next) {
    try {
      const {pageSize, current} = ctx.request.body
      const articles = await Article.find().populate({ path: 'labelId', model: 'tag' }).populate({ path: 'categoryId', model: 'category' }).skip(pageSize * (current - 1)).limit(parseInt(pageSize)).sort({_id: -1}).exec()
      const all = await Article.find().exec()
      const page = {
        current,
        pageSize,
        total: all.length
      }
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, articles, '获取用户列表成功', page)
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/article/getArticleById')
  @summary('通过_id获取文章')
  @ArticleTag
  @body(getArticleById)
  static async getArticleById (ctx) {
    try {
      const data = ctx.request.body
      const { _id, isEdit } = data
      let curArticle = await Article.findOne({_id: _id}).populate({ path: 'labelId', model: 'tag' }).populate({ path: 'categoryId', model: 'category' }).exec()
      if (!isEdit) {
        curArticle.content = Marked(curArticle.content.replace('<--more>', ''))
      }
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, curArticle, '获取文章详情成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
