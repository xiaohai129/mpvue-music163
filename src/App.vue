<script>
export default {
  created () {
    this.$store.dispatch('getSystemInfo')
    this.$store.dispatch('getAudioManager')
    this.$store.dispatch('getTopbarHeight')
    this.$store.dispatch('login')
  },
  mounted () {
    wx.hideTabBar()
  }
}
</script>
<style lang='scss'>
  @import '../static/iconfont/iconfont.css';
  page{height: 100%;}
  .layout{
    padding-bottom: 54PX;
    height: 100%;
    box-sizing: border-box;
  }
  img{width: 100%;height: 100%;}
</style>
