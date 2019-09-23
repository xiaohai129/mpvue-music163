// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const aggregate = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  let page = event.page || 0
  return db.collection('songs').aggregate()
    .group({
      _id: '$singer',
      count: aggregate.sum(1)
    }).sort({
      _id: 1
    }).skip(15 * page).limit(15).end()
}