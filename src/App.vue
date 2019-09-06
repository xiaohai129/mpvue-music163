<script>
export default {
  created () {
    this.$store.dispatch('getSystemInfo')
    this.$store.dispatch('getAudioManager')
  }
}
</script>
<style lang='scss'>
  img{width: 100%;height: 100%;}
</style>
