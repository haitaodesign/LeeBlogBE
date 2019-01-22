'use strict'
const mongoose = require('../lib/mongo')

module.exports = mongoose.model('user', {
  username: {type: 'string', require: true},
  password: {type: 'string', require: true},
  email: {type: 'string'},
  avatar: {type: 'string'}
})
