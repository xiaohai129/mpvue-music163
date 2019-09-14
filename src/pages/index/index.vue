<template>
  <div class="layout">
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },

  components: {
  },

  mounted () {
  },
  onShow () {
    wx.showTabBar()
    this.$mp.page.getTabBar().updateTabbarStatus('index')
  }
}
</script>

<style scoped>
</style>
