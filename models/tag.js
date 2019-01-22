'use strict'
const mongoose = require('../lib/mongo')

module.exports = mongoose.model('tag', {
  name: {type: 'string', require: true}
})
