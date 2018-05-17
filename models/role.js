'use strict'
const mongolass = require('../lib/mongo')

module.exports = mongolass.model('role', {
  name: {type: 'string', require: true}
})
