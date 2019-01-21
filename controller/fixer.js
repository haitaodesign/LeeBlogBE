import { request, summary, body, tags, middlewares, description } from 'koa-swagger-decorator'
import axios from 'axios'
const tag = tags(['Fixer.io'])

const userSchema = {
  base: { type: 'string', required: true }
}

const logTime = () => async (ctx, next) => {
  console.log(`start: ${new Date()}`)
  await next()
  console.log(`end: ${new Date()}`)
}

export default class FixerRouter {
  @request('POST', '/fixer/latest')
  @summary('汇率接口')
  @description('输入基础汇率，返回其他')
  @tag
  @middlewares([logTime()])
  @body(userSchema)
  static async fixer (ctx) {
    const { base } = ctx.request.body
    const { data } = await axios.get(`https://fixer.handlebarlabs.com/latest?base=${base}`)
    ctx.body = JSON.stringify(data)
  }
}
