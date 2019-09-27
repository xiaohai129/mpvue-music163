<template>
  <div class="layout">
    <div class="action_item" @click="clearCache">
      <div class="left">清除缓存</div>
      <div class="right iconfont icon-next"></div>
    </div>
    <div class="action_item">
      <div class="left">播放器歌词</div>
      <div class="right">
        <switch color='#fd4545' :checked='settings[0] == 1' @change="playerSetting($evnet, 0)" style="zoom:0.7"></switch>
      </div>
    </div>
    <div class="action_item">
      <div class="left">播放器动效</div>
      <div class="right">
        <switch color='#fd4545' :checked='settings[1] == 1' @change="playerSetting($evnet, 1)" style="zoom:0.7"></switch>
      </div>
    </div>
  </div>
</template>

<script>
import {showModal, showToast} from '@/utils'
export default {
  // settings
  // 1: 0: 隐藏歌词 1：显示歌词
  data () {
    return {
      isUpdate: false,
      settings: []
    }
  },

  methods: {
    clearCache () {
      showModal({
        title: '清除缓存',
        content: '清除缓存后您的播放记录及设置将被清空'
      }).then(res => {
        if (res.confirm) {
          wx.clearStorage()
        }
      })
    },
    playerSetting ($event, index) {
      this.isUpdate = true
      if (parseInt(this.settings[index]) === 1) {
        this.settings[index] = 0
      } else {
        this.settings[index] = 1
      }
      wx.setStorageSync('settings', this.settings.join(''))
    }
  },

  created () {
    let settings = wx.getStorageSync('settings')
    this.settings = settings.split('')
  },
  onUnload () {
    if (this.isUpdate) {
      showToast({
        title: '下次启动新设置生效',
        time: 2000
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.action_item{
  height: 40px;
  margin-left: 10px;
  line-height: 40px;
  border-bottom: 1px dashed #eee;
  display: flex;
  justify-content: space-between;
  .right{
    padding-right: 10px;
  }
  .icon-next{
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.6);
  }
}
.decorative_line{
  width: 100%;
  height: 10px;
  background: #eee;
}
</style>
