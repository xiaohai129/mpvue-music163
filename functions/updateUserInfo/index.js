// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let userInfo = event.userInfo
  return await db.collection('users').where({ _id: userInfo.openid}).get().then(res => {
    let data = {}
    if(res && res.data.length>0){
      return db.collection('users').where({
        _id: userInfo.openid
      }).update({
        data: {
          'avatarUrl': userInfo.avatarUrl,
          'grade': userInfo.grade,
          'nickName': userInfo.nickName
        }
      })
    }else{
      return db.collection('users').add({
        data: {
          '_id': userInfo.openid,
          'avatarUrl': userInfo.avatarUrl,
          'gender': userInfo.gender,
          'grade': 1,
          'integral': 0,
          'nickName': userInfo.nickName
        }
      })
    }
  }).then(res => {
    return db.collection('users').where({
      _id: res._id
    }).get()
  })
}