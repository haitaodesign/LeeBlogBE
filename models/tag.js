'use strict'
const mongolass = require('../lib/mongo')

module.exports = mongolass.model('tag', {
  name: {type: 'string', require: true}
})
