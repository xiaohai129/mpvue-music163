<template>
  <div 
    :class="[TextStyle,'topbar_wrap']" 
    :style="topbarStyle"
  >
    <div class='iconfont icon-back' 
      v-show="isBack"
      @click="gotoHomePage"
    ></div>
    <div class="title"><slot>{{title}}</slot></div>
    <div class="iconfont" v-show="isBack"></div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  props: ['title', 'TextStyle', 'isBack'],
  computed: {
    ...mapState(['topbarHeight', 'systemInfo']),
    topbarStyle () {
      return `
        padding-top: ${this.systemInfo.statusBarHeight}PX
      `
    }
  },
  methods: {
    gotoHomePage () {
      wx.switchTab({
        url: '/pages/index/main'
      })
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
    display: flex;
    justify-content: space-between;
    &.black{
      color: #000 !important;
      background: #000000;
    }
    &.white{
      background: #fff;      
    }
    .title{
      font-size: 16PX;
    }
    .iconfont{
      width: 60px;
      text-align: center;
    }
  }
</style>