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
      <lyric :lyric='songInfo.lyric' :currentTime='currentValue'/>
      <div class="control_wrap">
        <div class="play_control_btns">
          <div class="iconfont icon-shangyishou" @click="prev"></div>
          <div :class="'iconfont play_btn ' + (isPlay?'icon-zanting':'icon-bofang')"
                @click='switchPlayStatis'
          ></div>
          <div class="iconfont icon-xiayishou" @click="next"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import circularProgress from '@/components/circular_progress'
import xhslider from '@/components/slider'
import lyric from '@/components/lyric'
// import axios from 'axios'
import {mapState} from 'vuex'

export default {

  data () {
    return {
      currentValue: 1,
      countValue: 1,
      isPlay: true,
      songInfo: {
        title: '暂无歌曲',
        musicSrc: '',
        singer: '暂无歌手',
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
    lyric
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
    ...mapState(['audioManager'])
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
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
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
      position: fixed;
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
  }
  .needle{
    width: 90px;height: 130px;
    position: fixed;
    left: 50%;
    top: 0;
    z-index: 20;
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
  width: 290px;
  height: 290px;
  z-index: 0;
  position: absolute !important;
  top: 75px;
  left: 43px;
}
</style>