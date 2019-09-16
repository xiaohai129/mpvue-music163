import type from './mutations_type'

export default {
  [type.GET_SYSTEMINFO] (state, value) {
    if (value !== undefined) {
      state.systemInfo = value
    }
  },
  [type.GET_AUDIOMANAGER] (state, value) {
    state.audioManager = value
  },
  [type.GET_TOPBARHEIGHT] (state, value) {
    state.topbarHeight = value
  },
  [type.SET_SONGID] (state, value) {
    state.songid = value
  },
  [type.SET_USERINFO] (state, value) {
    state.userInfo = value
  },
  [type.SET_LOGINSTATE] (state, value) {
    state.isLogin = value
  }
}
