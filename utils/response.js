module.exports = (code = 0, data, msg = 'success', page = {}) => {
  return {
    code,
    data,
    msg,
    page
  }
}
