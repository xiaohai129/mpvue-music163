// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  let page = event.page || 0
  return await db.collection('songs').skip(15 * page).limit(15).field({
    type: false,
    musicSrc: false,
    lyric: false
  }).get()
}