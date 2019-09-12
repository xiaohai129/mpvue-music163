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
        <img src="/static/images/player/needle.png" class="needle"/>
        <div class="controlTime" v-show="isShowControlTime">{{controlValueStr}}</div>
        <circularProgress 
          :currentValue='currentValue' 
          :countValue='countValue' />
        <div class="disc_box" :style="{backgroundImage:'url(' + (songInfo.imgSrc||'') + ')'}">
          <img src="/static/images/player/disc.png"/>
          <img src="/static/images/player/disc_light.png" class="disc_light"/>
        </div>
        <lyric 
          :lyric='songInfo.lyric' 
          :currentTime='currentValue'
          ref="lyric"
        />
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
            <xhslider 
              :countValue='countValue' 
              :currentValue='currentValue'
              @changeEnd='seek'
              @change='sliderChange'
            />
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
      currentValue: 12,
      countValue: 120,
      controlValue: 0,
      isShowControlTime: false,
      isPlay: false,
      songInfo: {
        title: 'X音乐',
        musicSrc: '',
        singer: '',
        imgSrc: 'https://6d75-music163-4rnnj-1300176346.tcb.qcloud.la/images/disc_default.png?sign=835e1a26b0c711d26b8238c49823a1cf&t=1568257707',
        lyric: '',
        size: 0
      },
      playTimer: null,
      playList: [],
      playIndex: 0,
      ShowControlTimer: null
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
          title: data.title,
          size: data.size,
          lyric: data.lyric
        }
        this.countValue = data.size
        this.audioManager.src = this.songInfo.musicSrc
        this.audioManager.singer = this.songInfo.singer
        this.audioManager.coverImgUrl = this.songInfo.imgSrc
        this.audioManager.title = this.songInfo.title
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
    seek (time) {
      this.audioManager.seek(time)
      this.$refs.lyric.findLyricIndex(time)
    },
    sliderChange (time) {
      clearTimeout(this.ShowControlTimer)
      this.isShowControlTime = true
      this.controlValue = time
      this.ShowControlTimer = setTimeout(() => {
        this.isShowControlTime = false
      }, 2000)
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
    },
    controlValueStr () {
      return getSongTimeStr(this.controlValue)
    }
  },

  created () {
    this.getPlayList()
    this.audioManager.onStop(() => {
      this.isPlay = false
    })
    this.audioManager.onEnded(() => {
      this.next()
    })
  },

  onHide () {
    this.isPlay = false
  },

  onShow () {
    if (this.audioManager.paused && !this.audioManager.paused) {
      this.isPlay = true
    }
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
@keyframes hide {
  0%{
    display: block;
  }
  100%{
    display: none !important;
  }
}
@keyframes show {
  0%{
    display: none;
  }
  100%{
    display: block !important;
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
      transform: rotate(4deg) !important;
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
    .controlTime{
      transform: display .5s ease-in;
      position: absolute;
      top: 122px;
      width: 196px;
      height: 196px;
      line-height: 200px;
      text-align: center;
      background: rgba($color: #000, $alpha: 0.8);
      font-size: 20px;
      color: #fff;
      z-index: 4;
      border-radius: 50%;
      left: 50%;
      margin-left: -98px;
    }
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
      width: 90px;
      height: 130px;
      position: absolute;
      left: 50%;
      top: 0;
      z-index: 20;
      margin-left: -14px;
      transform: rotate(-30deg);
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
  left: 44px;
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