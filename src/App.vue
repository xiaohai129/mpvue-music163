<script>
export default {
  created () {
    this.$store.dispatch('getSystemInfo')
    this.$store.dispatch('getAudioManager')
    this.$store.dispatch('getTopbarHeight')
    wx.setStorageSync('songImg', '/static/images/player/disc_default.png')
    wx.hideTabBar()
  }
}
</script>
<style lang='scss'>
  @import '../static/iconfont/iconfont.css';
  page,.layout{min-height: 100%;}
  img{width: 100%;height: 100%;}
</style>
