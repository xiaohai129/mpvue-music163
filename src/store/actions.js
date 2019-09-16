import type from './mutations_type'

export default {
  getSystemInfo (context) {
    wx.getSystemInfo({
      success (res) {
        context.commit(type.GET_SYSTEMINFO, res)
      }
    })
  },
  getAudioManager (context) {
    context.commit(type.GET_AUDIOMANAGER, wx.getBackgroundAudioManager())
  },
  getTopbarHeight (context) {
    let height = context.state.systemInfo.statusBarHeight + 45
    context.commit(type.GET_TOPBARHEIGHT, height)
  },
  setSongid (context, id) {
    context.commit(type.SET_SONGID, id)
  },
  login (context) {
    return wx.cloud.callFunction({
      name: 'getUserInfo'
    }).then(res => {
      let openid = res.result.OPENID
      if (openid) {
        wx.getUserInfo({
          success (res) {
            console.log(res)
            let userInfo = {
              avatarUrl: res.userInfo.avatarUrl,
              openid: openid,
              nickName: res.userInfo.nickName,
              gender: res.userInfo.gender
            }
            context.commit(type.SET_USERINFO, userInfo)
            context.commit(type.SET_LOGINSTATE, true)
            wx.cloud.callFunction({
              name: 'updateUserInfo',
              data: {
                userInfo: userInfo
              }
            }).then(res => {
              console.log(res)
            })
          },
          fail (err) {
            console.log(err)
            let userInfo = {...context.state.userInfo}
            userInfo.openid = openid
            context.commit(type.SET_USERINFO, userInfo)
            context.commit(type.SET_LOGINSTATE, false)
          }
        })
      }
    })
  }
}
