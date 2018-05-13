const {mongodb} = require('config-lite')(__dirname)

const Mongolass = require('mongolass')
const day = require('dayjs')
const objectidToTimestamp = require('objectid-to-timestamp')

const mongolass = new Mongolass()
mongolass.plugin('addCreatedAt', {
  afterFindOne (result) {
    if (result) {
      result.created_at = day(objectidToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss')
    }
    return result
  },
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = day(objectidToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  }
})
mongolass.connect(`mongodb://${mongodb.host}:${mongodb.port}/${mongodb.name}`)

module.exports = mongolass
