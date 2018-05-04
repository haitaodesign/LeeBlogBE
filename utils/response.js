module.exports = (code = 0, data, msg = 'success') => {
  return {
    code,
    data,
    msg
  }
}
