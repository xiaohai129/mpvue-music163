// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  let page = event.page || 0
  let type = event.type+1 || 1
  let ids = event.ids || []
  if(ids.length > 0){
    return db.collection('songs').where({
      _id: db.command.in(ids)
    }).field({
      type: false,
      musicSrc: false,
      lyric: false
    }).get()
  }
  return await db.collection('classify').where({
    _id: type
  }).get().then(res => {
    let data = res.data
    return db.collection('songs').where({
      _id: db.command.in(data[0].list)
    }).skip(15 * page).limit(15).field({
      type: false,
      musicSrc: false,
      lyric: false
    }).get()
  })
}