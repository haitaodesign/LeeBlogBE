/**
 * 标签管理
 */
import {
  request,
  summary,
  query,
  path,
  body,
  tags
} from 'koa-swagger-decorator'
import Label from '../models/label'
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

export default class LabelController {
  @request('post','label/add')
  @summary('添加一个标签')
  @LabelTag
  @body(labelSchema)
  static async add (ctx,next){
    try {
      const {name} = ctx.request.body
      ctx.checkBody('name').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      await Label.create({name}).exec()
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '标签添加成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
  @request('delete','label/delete/{_id}')
  @summary('删除一个标签')
  @LabelTag
  @path({
    _id:{type:'string',require:true,descripttion:'唯一_id'}
  })
  static async delete (ctx,next){
    try {
      const {_id} = ctx.params
      ctx.checkParams('_id').notEmpty()
      if (ctx.errors) {
        let field = Object.keys(ctx.errors[0])
        throw new Error(ctx.errors[0][field])
      }
      // 删除之前应该查找此标签是否被使用，若被使用则不能删除
      await Label.deleteOne({_id}).exec()
      ctx.body = response(constants.CUSTOM_CODE.SUCCESS, {}, '删除标签成功')
    } catch (error) {
      throw new CustomError(constants.HTTP_CODE.BAD_REQUEST, error.message)
    }
  }
}


