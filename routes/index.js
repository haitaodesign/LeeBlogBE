import Router from 'koa-router'
import ApiRouter from './router'
const router = new Router()

router.use('/api', ApiRouter.routes())

export default router
