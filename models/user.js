'use strict'
const mongolass = require('../lib/mongo')

module.exports = mongolass.model('user', {
  username: {type: 'string', require: true},
  password: {type: 'string', require: true},
  email: {type: 'string'},
  avatar: {type: 'string'}
})
