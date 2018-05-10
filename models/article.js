'use strict'
const mongolass = require('../lib/mongo')

module.exports = mongolass.model('article', {
  title: {type: 'string', require: true},
  content: {type: 'string', require: true},
  isPublish: {type: 'boolean', require: true},
  update_at: {type: 'string', require: true},
  user_id: {type: 'string', require: true},
  category_id: {type: 'string'},
  label_id: {type: 'string'}
})
