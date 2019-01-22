'use strict'
const mongoose = require('../lib/mongo')

module.exports = mongoose.model('category', {
  name: {type: 'string', require: true}
  // user_id: {type: 'string', require: true}
})
