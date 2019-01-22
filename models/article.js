'use strict'
const mongoose = require('../lib/mongo')

const articleSchems = new mongoose.Schema({
  title: {type: 'string', require: true},
  content: {type: 'string', require: true},
  isPublish: {type: 'boolean', require: true},
  user_id: {type: 'string', require: true},
  categoryId: {type: 'string'},
  labelId: {type: 'array'}
}, {
  timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}
})

module.exports = mongoose.model('article', articleSchems)
