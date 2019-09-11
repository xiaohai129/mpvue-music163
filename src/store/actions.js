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
  }
}
