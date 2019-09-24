// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  let list = event.list
  if (list) {
    return db.collection('likes').update({
      data: {
        'list': list
      }
    })
  }
  return db.collection('likes').where({
    '_id': openId
  }).get()
}