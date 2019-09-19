// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let keywords = event.keywords || ''
  if(keywords.length <= 0){
    return []
  }
  return await db.collection('songs').where({
    title: db.RegExp({
      regexp: '(' + keywords + ')',
      options: 'i'
    })
  }).get().then(res1 => {
    return db.collection('songs').where({
      songer: '(' + keywords + ')',
      options: 'i'
    }).get().then(res2 => {
      return {
        songs: res1.data,
        singers: res2.data
      }
    })
  })
}