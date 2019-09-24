// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  let userInfo = event.userInfo
  return await db.collection('users').where({ _id: userInfo._id}).get().then(res => {
    let data = {}
    if(res && res.data.length>0){
      if (!userInfo._id) {
        return false
      }
      return db.collection('users').where({
        _id: userInfo._id
      }).update({
        data: {
          'avatarUrl': userInfo.avatarUrl,
          'gender': userInfo.gender,
          'nickName': userInfo.nickName,
          'integral': userInfo.integral
        }
      }).then(res => {
        return userInfo
      })
    }else{
      db.collection('likes').add({
        data: {
          '_id': userInfo.openid,
          'list': []
        }
      })
      return db.collection('users').add({
        data: {
          '_id': userInfo.openid,
          'avatarUrl': userInfo.avatarUrl,
          'gender': userInfo.gender,
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