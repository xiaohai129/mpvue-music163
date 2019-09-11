<template>
  <div class="layout">
    <topbar>
      {{songInfo.title}}<span class="singer_name">{{songInfo.singer}}</span>
    </topbar>
    <div :class="[{'played':isPlay},'player_wrap']">
      <div class="player_mask" :style="{backgroundImage:'url(' + (songInfo.imgSrc||'') + ')'}">
        <div class="mask_black"></div>
      </div>
      <div class="player_content_box" :style="playerStyle">
        <img src="/static/images/player/needle.png" class="needle">
        <circularProgress 
          :currentValue='currentValue' 
          :countValue='countValue' />
        <div class="disc_box" :style="{backgroundImage:'url(' + (songInfo.imgSrc||'') + ')'}">
          <img src="/static/images/player/disc.png">
          <img src="/static/images/player/disc_light.png" class="disc_light"/>
        </div>
        <lyric :lyric='songInfo.lyric' :currentTime='currentValue'/>
        <div class="control_wrap">
          <div class="play_control_btns">
            <div class="iconfont icon-shangyishou" @click="prev"></div>
            <div :class="'iconfont play_btn ' + (isPlay?'icon-zanting':'icon-bofang')"
                  @click='switchPlayStatis'
            ></div>
            <div class="iconfont icon-xiayishou" @click="next"></div>
          </div>
          <div class="play_progress">
            <span>{{currentValueStr}}</span>
            <xhslider :countValue='countValue' :currentValue='currentValue'/>
            <span>{{countValueStr}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import circularProgress from '@/components/circular_progress'
import xhslider from '@/components/slider'
import lyric from '@/components/lyric'
import topbar from '@/components/topbar'
// import axios from 'axios'
import {mapState} from 'vuex'
import {getSongTimeStr} from '@/utils'

export default {

  data () {
    return {
      currentValue: 0,
      countValue: 0,
      isPlay: true,
      songInfo: {
        title: 'X音乐',
        musicSrc: '',
        singer: '',
        imgSrc: '/static/images/player/disc_default.png',
        lyric: '',
        size: 0
      },
      playTimer: null,
      playList: [],
      playIndex: 0
    }
  },

  methods: {
    play () {
      let songid = this.playList[this.playIndex]
      wx.cloud.callFunction({
        name: 'getSongInfo',
        data: {
          songid: songid
        }
      }).then(res => {
        let data = res.result
        this.songInfo = {
          musicSrc: data.musicSrc,
          singer: data.singer,
          imgSrc: data.imgSrc,
          name: data.title,
          size: data.size,
          lyric: data.lyric
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
    next () {
      if (this.playIndex < this.playList.length) {
        this.playIndex++
      } else {
        this.playIndex = 0
      }
      this.play()
    },
    prev () {
      if (this.playIndex > 0) {
        this.playIndex--
      } else {
        this.playIndex = this.playList.length - 1
      }
      this.play()
    },
    switchPlayStatis () {
      if (this.audioManager.paused || !this.isPlay) {
        if (this.audioManager.src && this.audioManager.src.length > 0) {
          this.audioManager.play()
          this.isPlay = true
        } else {
          this.play()
        }
      } else {
        this.pause()
      }
    },
    getPlayList () {
      wx.cloud.callFunction({
        name: 'getSongidList'
      }).then(res => {
        let data = res.result.data
        let playList = []
        for (let i in data) {
          playList.push(data[i]._id)
        }
        this.playList = playList
      })
    }
  },

  components: {
    circularProgress,
    xhslider,
    lyric,
    topbar
  },

  watch: {
    isPlay (value, oldValue) {
      if (value) {
        this.playTimer = setInterval(() => {
          this.currentValue = this.audioManager.currentTime
        }, 200)
      } else {
        clearInterval(this.playTimer)
      }
    }
  },

  computed: {
    ...mapState(['audioManager', 'topbarHeight']),
    playerStyle () {
      return `
        height:calc(100% - ${this.topbarHeight + 10}px)
      `
    },
    currentValueStr () {
      return getSongTimeStr(this.currentValue)
    },
    countValueStr () {
      return getSongTimeStr(this.countValue)
    }
  },

  created () {
    this.getPlayList()
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
  overflow: hidden;
  bottom: 0;
  left: 0;
  // 音乐播放状态
  &.played{
    .disc_box{
      animation-play-state:running !important;
    }
    .needle{
      transform: rotate(8deg) !important;
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
    background-size: auto 150%;
    .mask_black{
      background-color: rgba($color: #000000, $alpha: 0.5);
      width: 100%;
      height: 100%;
    }
  }
  .player_content_box{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 10;
    .disc_box{
      width: 300px;
      height: 300px;
      margin: 70px auto 0 auto;
      background: no-repeat center center;
      background-size: 194px 194px;
      animation: played 15s linear infinite;
      animation-play-state:paused;
      .disc_light{
        position: absolute;
        top: 0;
        left: 0;
        z-index: 8;
      }
    }
    .control_wrap{
      position: absolute;
      bottom: 0;
      padding-bottom: 15px;
      width: 100%;
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
    .play_progress{
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        display: inline-block;
        font-size: 12px;
        color: #fff;
        vertical-align: top;
        width: 50px;
        text-align: center;
      }
    }
    .needle{
      width: 90px;height: 130px;
      position: absolute;
      left: 50%;
      top: 0;
      z-index: 20;
      transform: rotate(-30deg);
      margin-left: -14px;
      margin-top: -5px;
      transform-origin: 16px 12px; 
      transition: transform 0.5s ease-in;
    }
  }
}
</style>
<style lang="scss">
.circular_progress{
  width: 290px;
  height: 290px;
  z-index: 0;
  position: absolute !important;
  top: 75px;
  left: 43px;
}
.xh_slider{
  width: 250px !important;
}
.singer_name{
  font-size: 12px;
  color: rgba($color: #fff, $alpha: 0.8);
  margin-left: 6px;
}
</style>