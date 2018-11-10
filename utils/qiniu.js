const qiniu = require('qiniu')

const configCdn = require('../config/default.js')

const { bucket, ak, sk } = configCdn.qiniu

export const getToken = () => {
  const mac = new qiniu.auth.digest.Mac(ak, sk)
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2
  const options = {
    scope: bucket
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}
