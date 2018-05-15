'use strict'
const mongolass = require('../lib/mongo')

module.exports = mongolass.model('category', {
  name: {type: 'string', require: true}
  // user_id: {type: 'string', require: true}
})
