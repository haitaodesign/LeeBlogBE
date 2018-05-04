const router = require('koa-router')()
const user = require('../controller/user')
const {CustomError, HttpError} = require('../utils/customError')
router.post('/user/add', user.add)
module.exports = router
