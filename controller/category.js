/**
 * 管理
 */
import {
  request,
  summary,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
import Category from '../models/category'
const {
  CustomError
} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')

const CategoryTag = tags(['category'])

const categorySchema = {
  _id: {
    type: 'string',
    descripttion: '唯一id'
  },
  name: {
    type: 'string',
    require: true,
    descripttion: '分类名称'
  }
}
let CategoryPageSchema = {
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

export default class CategoryController {
  @request('post', '/category/add')
  @summary('新建一个分类')
  @CategoryTag
  @body(categorySchema)
  static async add (ctx, next) {
    try {
      const {name} = ctx.request.body
      ctx.checkBody('name').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      await Category.create({name})
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '分类添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('delete', '/category/delete/{_id}')
  @summary('删除一个分类')
  @CategoryTag
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
      // 删除之前应该查找此标签是否被使用，若被使用则不能删除
      await Category.deleteOne({_id})
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '删除分类成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/category/update')
  @summary('修改一个分类')
  @CategoryTag
  @body(categorySchema)
  static async update (ctx, next) {
    try {
      const data = ctx.request.body
      const {_id} = data
      const curCategory = await Category.findOne({_id})
      const getCategoryId = curCategory._id
      if (_id === getCategoryId.toString()) {
        await Category.update({_id: getCategoryId}, {$set: data})
        ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '修改分类成功')
      }
    } catch (error) {
      ctx.body = response(constants.CUSTOM_CODE.ERROR, {}, '修改分类失败')
    }
  }
  @request('post', '/categories')
  @summary('获取分类列表')
  @CategoryTag
  @body(CategoryPageSchema)
  static async getUserList (ctx, next) {
    try {
      const {pageSize, current} = ctx.request.body
      const categories = await Category.find().skip(pageSize * (current - 1)).limit(parseInt(pageSize)).sort({_id: -1})
      const all = await Category.find()
      const page = {
        current,
        pageSize,
        total: all.length
      }
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, categories, '获取分类列表成功', page)
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
