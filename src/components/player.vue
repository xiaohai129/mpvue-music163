<template>
  <div :class="[{'played':isPlay},'player_wrap']">
    <div class="player_mask" :style="{backgroundImage:'url(' + (songInfo.imgSrc||'') + ')'}">
      <div class="mask_black"></div>
    </div>
    <img src="/static/images/player/needle.png" class="needle">
    <div class="player_content_box">
      <circularProgress 
        :currentValue='currentValue' 
        :countValue='countValue' />
      <div class="disc_box" :style="{backgroundImage:'url(' + (songInfo.imgSrc||'') + ')'}">
        <img src="/static/images/player/disc.png">
        <img src="/static/images/player/disc_light.png" class="disc_light"/>
      </div>
      <div class="play_control_btns">
        <div class="iconfont icon-shangyishou"></div>
        <div :class="'iconfont play_btn ' + (isPlay?'icon-zanting':'icon-bofang')"
              @click='switchPlayStatis'
        ></div>
        <div class="iconfont icon-xiayishou"></div>
      </div>
      <div class="voice_control_btns">
        <div class="iconfont icon-yinliang-guan"></div>
        <xhslider/>
        <div class="iconfont icon-yinliang-gao"></div>
      </div>
    </div>
  </div>
</template>

<script>
import circularProgress from '@/components/circular_progress'
import xhslider from '@/components/slider'
// import axios from 'axios'
import {mapState} from 'vuex'

export default {
  data () {
    return {
      songImg: '/static/images/player/109951164217552025.jpg',
      currentValue: 0,
      countValue: 1,
      isPlay: false,
      songInfo: {
        title: '暂无歌曲',
        musicSrc: '',
        singer: '暂无歌手',
        imgSrc: '',
        lrc: '',
        size: 0
      },
      playTimer: null
    }
  },
  created () {
    this.play()
  },

  methods: {
    play (songid) {
      wx.cloud.callFunction({ name: 'getSongInfo' }).then(res => {
        let data = res.result
        this.songInfo = {
          musicSrc: data.musicSrc,
          singer: data.singer,
          imgSrc: data.imgSrc,
          name: data.title,
          size: data.size
        }
        this.countValue = data.size
        this.audioManager.src = this.songInfo.musicSrc
        this.audioManager.singer = this.songInfo.singer
        this.audioManager.coverImgUrl = this.songInfo.imgSrc
        this.audioManager.title = this.songInfo.name
        this.isPlay = true
      })
    },
    pause () {
      this.audioManager.pause()
      this.isPlay = false
    },
    switchPlayStatis () {
      if (this.audioManager.paused) {
        this.audioManager.play()
        this.isPlay = true
      } else {
        this.pause()
      }
    }
  },

  components: {
    circularProgress,
    xhslider
  },

  watch: {
    isPlay (value, oldValue) {
      if (value) {
        this.playTimer = setInterval(() => {
          this.currentValue = parseInt(this.audioManager.currentTime)
        }, 1000)
      } else {
        clearInterval(this.playTimer)
      }
    }
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
    .play_control_btns{
      color: #fff;
      display: flex;
      justify-content: space-between;
      width: 190px;
      line-height: 32px;
      margin: 20px auto;
      .iconfont{
        font-size: 24px;
      }
      .play_btn{
        font-size: 32px;
        color:$main-color;
      }
    }
    .voice_control_btns{
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      .iconfont{
        width: 24px;
        height: 24px;
        font-size: 24px;
        margin: -3px 10px 0 10px;
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
    transition: transform 0.5s ease-in;
  }
}
</style>
<style lang="scss">
.circular_progress{
  width: 295px;
  height: 295px;
  position: absolute;
  z-index: 7;
  top:3px;
  left: 50%;
  transform: translate(-50%);
}
.xh_slider{
  width: 280px;
}
</style>