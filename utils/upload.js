
const fs = require('fs')
const qiniu = require('qiniu')
const cdnConfig = require('../config/default.js')
const { ak, sk, bucket } = cdnConfig.qiniu
// 文件操作方法

export default class Upload {
  /**
   * 获取文件扩展名
   * @param {*} filename 文件名
   */
  static getFileNameExtension (filename) {
    let ext = filename.split('.')
    return ext[ext.length - 1]
  }
  // 生成文件夹名称
  static getUploadDirName () {
    const date = new Date()
    let month = Number.parseInt(date.getMonth()) - 1
    month = month.toString().length > 1 ? month : `0${month}`
    const folderName = `${date.getFullYear()}${month}${date.getDate()}`
    return folderName
  }
  /**
   * 检查文件夹是否存在
   * @param {*} folder 文件夹
   */
  static checkDirExist (folder) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
  }
  /**
   * 重命名上传的文件名
   * @param {*} ext 文件扩展名
   */
  static getUploadFileName (ext) {
    return `${Date.now()}${Number.parseInt(Math.random() * 10000)}.${ext}`
  }
  /**
   * 上传至七牛云
   * @param {*} key 文件
   * @param {*} file 文件所在目录
   */
  static uploadQiNiu (key, file) {
    const mac = new qiniu.auth.digest.Mac(ak, sk)
    const config = new qiniu.conf.Config()
    config.zone = qiniu.zone.Zone_z2
    const options = {
      scope: bucket + ':' + key
    }
    const fromUploader = new qiniu.form_up.FormUploader(config)
    const putExtra = new qiniu.form_up.PutExtra()
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    return new Promise((resolve, reject) => {
      fromUploader.putFile(uploadToken, key, file, putExtra, (err, body, info) => {
        if (err) {
          return reject(err)
        }
        if (info.statusCode === 200) {
          resolve(body)
        } else {
          reject(body)
        }
      })
    })
  }
}
