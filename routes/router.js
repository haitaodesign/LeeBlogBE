import Router from 'koa-router'
import User from '../controller/user'
import Test from '../controller/test'
import Label from '../controller/label'
import Category from '../controller/category'
import Article from '../controller/article'
import {wrapper} from 'koa-swagger-decorator'
const router = new Router()
wrapper(router)
router.swagger({
  title: 'LeeBlogBE',
  description: 'API 文档',
  version: '0.0.1',
  prefix: '/api',
  swaggerHtmlEndpoint: '/swagger-html',
  swaggerJsonEndpoint: '/swagger-json',
  swaggerOptions: {
    securityDefinitions: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      }
    }
  }
})

router.map(User)
router.map(Label)
router.map(Category)
router.map(Article)
// router.map(Test)

export default router
