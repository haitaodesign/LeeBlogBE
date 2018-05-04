const router = require('koa-router')()
const user = require('../controller/user')
router.post('/user/add', user.add)
module.exports = router
