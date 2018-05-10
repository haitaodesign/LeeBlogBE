'use strict'
const mongolass = require('../lib/mongo')

module.exports = mongolass.model('label', {
  name: {type: 'string', require: true}
})
