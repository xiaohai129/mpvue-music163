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
    this.$mp.page.getTabBar().updateTabbarStatus('index')
  }
}
</script>

<style scoped>
</style>
