
const fs = require('fs')
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
}
