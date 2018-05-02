const {mongodb} = require('config-lite')(__dirname)

const Mongolass = require('mongolass')

const mongolass = new Mongolass()

mongolass.connect(`mongodb://${mongodb.host}/${mongodb.port}/${name}`)

module.exports=mongolass