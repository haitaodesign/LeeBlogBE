
const ERROR_MSG = require('./errorMsg')

class CustomError extends Error {
  constructor (code, msg) {
    super()
    this.code = code
    this.msg = msg || ERROR_MSG[code] || 'unkown error'
  }
  getCodeMsg () {
    return {
      code: this.code,
      msg: this.msg
    }
  }
}

/* eslint-disable no-useless-constructor */
class HttpError extends CustomError {
  constructor (...args) {
    super(...args)
  }
}

module.exports = {
  CustomError,
  HttpError
}
