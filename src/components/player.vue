<template>
  <div :class="[{'played':isPlay},'player_wrap']">
    <div class="player_mask" :style="{backgroundImage:'url(' + (songImg||'') + ')'}">
      <div class="mask_black"></div>
    </div>
    <img src="/static/images/player/needle.png" class="needle">
    <div class="player_content_box">
      <circularProgress 
        :currentValue='currentValue' 
        :countValue='countValue' />
      <div class="disc_box" :style="{backgroundImage:'url(' + (songImg||'') + ')'}">
        <img src="/static/images/player/disc.png">
        <img src="/static/images/player/disc_light.png" class="disc_light"/>
      </div>
      <div class="action_btns">
        <div class="iconfont icon-shangyishou"></div>
        <div class="iconfont icon-xiayishou"></div>
      </div>
    </div>
  </div>
</template>

<script>
import circularProgress from '@/components/circular_progress'
// import axios from 'axios'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      songImg: '/static/images/player/109951164217552025.jpg',
      currentValue: 1,
      countValue: 1,
      isPlay: false,
      songInfo: {
        name: '暂无歌曲',
        musicUrl: 'http://m801.music.126.net/20190906180419/8a28867388a8927be1fc2e137a11060b/jdyyaac/565a/035d/545d/a0f1d81d6647cf5ee767c7c8232ec693.m4a',
        singer: '暂无歌手',
        picUrl: '',
        lrc: ''
      }
    }
  },
  created () {

  },

  methods: {
    play (songid) {
      wx.cloud.callFunction({ name: 'getSongInfo' }).then(res => {
        console.log(res)
      })
      this.audioManager.src = this.songInfo.musicUrl
      this.audioManager.singer = this.songInfo.singer
      this.audioManager.coverImgUrl = this.songInfo.picUrl
      this.audioManager.title = this.songInfo.name
      this.isPlay = true
    },
    stop () {
      this.audioManager.stop()
      this.isPlay = false
    }
  },

  components: {
    circularProgress
  },

  computed: {
    ...mapState(['audioManager'])
  }
}
</script>

<style lang="scss" scoped>
@keyframes played{
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
.player_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  // 音乐播放状态
  &.played{
    .disc_box{
      animation-play-state:running !important;
    }
    .needle{
      transform: rotate(8deg);
    }
  }
  .player_mask{
    filter: blur(20PX);
    width: 120%;
    height: 120%;
    position: absolute;
    top: -10%;
    left: -10%;
    z-index: 1;
    background: no-repeat center center;
    background-size: auto 100%;
    .mask_black{
      background-color: rgba($color: #000000, $alpha: 0.5);
      width: 100%;
      height: 100%;
    }
  }
  .player_content_box{
    position: relative;
    z-index: 5;
    .disc_box{
      width: 300px;
      height: 300px;
      margin: 70px auto 0 auto;
      background: no-repeat center center;
      background-size: 194px 194px;
      position: relative;
      animation: played 15s linear infinite;
      animation-play-state:paused;
      .disc_light{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 8;
      }
    }
  }
  .needle{
    width: 90px;height: 130px;
    position: absolute;
    left: 50%;
    top: 0;
    z-index: 10;
    transform: rotate(-30deg);
    margin-left: -14px;
    margin-top: -5px;
    transform-origin: 14px 12px; 
    transition: transform 1s ease-in;
  }
}
</style>
<style lang="scss">
.circular_progress{
  width: 290px;
  height: 290px;
  position: absolute;
  z-index: 7;
  left: 50%;
}
</style>