// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let data = await db.collection('songs').get()
  data = data.data[0]
  let fileList = await cloud.getTempFileURL({
    fileList: [
      data.musicSrc,
      data.imgSrc
    ]
  })
  fileList = fileList.fileList
  data.musicSrc = fileList[0].tempFileURL
  data.imgSrc = fileList[1].tempFileURL
  return data
}