/**
 * 标签管理
 */
import {
  request,
  summary,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
import Tag from '../models/tag'
const {
  CustomError
} = require('../utils/customError')
const constants = require('../utils/constants')
const response = require('../utils/response')

const LabelTag = tags(['标签管理'])

const labelSchema = {
  name: {
    type: 'string',
    require: true,
    descripttion: '标签名称'
  }
}

const updateLabel = Object.assign(labelSchema, {
  _id: {
    type: 'string',
    require: true,
    descripttion: '唯一_id'
  }
})
let LabelPageSchema = {
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

export default class TagController {
  @request('post', '/tag/add')
  @summary('添加一个标签')
  @LabelTag
  @body(labelSchema)
  static async add (ctx, next) {
    try {
      const {name} = ctx.request.body
      ctx.checkBody('name').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      await Tag.create({name})
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '标签添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('delete', '/tag/delete/{_id}')
  @summary('删除一个标签')
  @LabelTag
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
      await Tag.deleteOne({_id})
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '删除标签成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('post', '/tag/update')
  @summary('修改一个标签')
  @LabelTag
  @body(updateLabel)
  static async update (ctx, next) {
    try {
      const data = ctx.request.body
      const {_id} = data
      const curLabel = await Tag.findOne({_id})
      const getLabelId = curLabel._id
      if (_id === getLabelId.toString()) {
        await Tag.update({_id: getLabelId}, {$set: data})
        ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '修改标签成功')
      }
    } catch (error) {
      ctx.body = response(constants.CUSTOM_CODE.ERROR, {}, '修改标签失败')
    }
  }
  @request('post', '/tags')
  @summary('获取标签列表')
  @LabelTag
  @body(LabelPageSchema)
  static async getLabelList (ctx, next) {
    try {
      const {pageSize, current} = ctx.request.body
      const labels = await Tag.find().skip(pageSize * (current - 1)).limit(parseInt(pageSize)).sort({_id: -1})
      const all = await Tag.find()
      const page = {
        current,
        pageSize,
        total: all.length
      }
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, labels, '获取用户列表成功', page)
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}
