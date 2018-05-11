import user from '../controller/user'
const router = require('koa-router')()
router.post('/user/add', user.add)
module.exports = router
