<template>
  <div class="layout_wrap">
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

  created () {
  },
  mounted () {
  },
  onShow () {
    this.$mp.page.getTabBar().updateTabbarStatus('mine')
  }
}
</script>

<style scoped>

</style>
