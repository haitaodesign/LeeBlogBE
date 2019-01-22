const {mongodb} = require('config-lite')(__dirname)
const mongoose = require('mongoose')
// const day = require('dayjs')
// const objectidToTimestamp = require('objectid-to-timestamp')

// const mongolass = new Mongolass()
// mongolass.plugin('addCreatedAt', {
//   afterFindOne (result) {
//     if (result) {
//       result.created_at = day(objectidToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss')
//     }
//     return result
//   },
//   afterFind: function (results) {
//     results.forEach(function (item) {
//       item.created_at = day(objectidToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
//     })
//     return results
//   }
// })
const url = `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.name}`
mongoose.connect(url, {useMongoClient: true})

module.exports = mongoose
