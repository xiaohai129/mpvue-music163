<template>
  <div 
    :class="[TextStyle,'topbar_wrap']" 
    :style="topbarStyle"
  >
    <div class="title"><slot>{{title}}</slot></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: ['title', 'TextStyle'],
  computed: {
    ...mapState(['topbarHeight', 'systemInfo']),
    topbarStyle () {
      return `
        padding-top: ${this.systemInfo.statusBarHeight}px
      `
    }
  },
  created () {
  }
}
</script>

<style lang='scss' scoped>
  .topbar_wrap{
    height: 42PX;
    line-height: 42PX;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    color: #fff;
    text-align: center;
    &.black{
      color: #000 !important;
      background: #000000;
    }
    &.white{
      background: #fff;      
    }
    .title{
      font-size: 14PX;
    }
  }
</style>