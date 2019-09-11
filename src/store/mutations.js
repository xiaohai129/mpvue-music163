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
  }
}
