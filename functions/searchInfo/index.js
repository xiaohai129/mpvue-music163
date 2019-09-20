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
  }).field({
    _id: true,
    title: true
  }).get().then(res1 => {
    let data =res1.data
    let strIndex = 0
    let songs = []
    while (data.length > 0) {
      for (let i in data) {
        if (data[i].title.indexOf(keywords) <= strIndex || data.length == 1) {
          songs.push(data[i])
          data.splice(i, 1)
        }
      }
      strIndex += 1
    }
    res1.data = songs
    return db.collection('songs').where({
      singer: db.RegExp({
        regexp: '(' + keywords + ')',
        options: 'i'
      })
    }).field({
      _id: true,
      singer: true
    }).get().then(res2 => {
      let singers = []
      let data = res2.data
      let strIndex = 0
      while (data.length > 0) {
        for (let i in data) {
          if (data[i].singer.indexOf(keywords) <= strIndex || data.length == 1) {
            singers.push(data[i])
            data.splice(i, 1)
          }
        }
        strIndex += 1
      }
      let oSingers = {}
      for (let i in singers){
        let item = singers[i]
        if (oSingers[item.singer]) {
          oSingers[item.singer].push(item._id)
        } else {
          oSingers[item.singer] = [item._id]
        }
      }
      singers = []
      for (let key in oSingers) {
        singers.push({
          singer: key,
          list: oSingers[key]
        })
      }
      return {
        songs: res1.data,
        singers: singers
      }
    })
  })
}