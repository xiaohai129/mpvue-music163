<template>
  <div class="layout" :data-songid='songid'>
    <xhtopbar :isBack='true'>
      <div class="song_text_info">
        <p class="title">{{songInfo.title}}</p>
        <p class="singer" v-show="songInfo.singer.length>0">
          {{songInfo.singer}}
        </p>
      </div>
    </xhtopbar>
    <div :class="[{'played':isPlay},'player_wrap',{'clean_player_mode':lyricMode=='full'}]">
      <div class="player_mask" :style="{backgroundImage:'url(' + (maskBgImg || '') + ')'}">
        <div class="mask_black"></div>
      </div>
      <div class="player_content_box" :style="playerStyle">
        <div class="disc_box">
          <img :src="songInfo.imgSrc" class="song_img"
            @load="setMaskBgImg"
          />
          <div class="controlTime" v-show="isShowControlTime">{{controlValueStr}}</div>
          <circularProgress 
            :currentValue='currentValue'
            :countValue='countValue'
            :isShow='lyricMode=="small"'
          />
          <cover-view class="play_btn_mask" @click="switchPlayStatis">
            <cover-image class="icon_play" src="/static/images/player/icon-play.png"/>
          </cover-view>
        </div>
        <lyric 
          :lyric='songInfo.lyric' 
          :currentTime='currentValue'
          ref="lyric"
          @change="lyricShowChange"
        />
        <div class="control_wrap">
          <div class="play_control_btns">
            <div class="iconfont icon-liebiao"></div>
            <div class="iconfont icon-shangyishou" @click="prev"></div>
            <div :class="'iconfont play_btn ' + (isPlay?'icon-zanting':'icon-bofang')"
                  @click='switchPlayStatis'
            ></div>
            <div class="iconfont icon-xiayishou" @click="next"></div>
            <div 
              :class="['iconfont','icon-xihuan2','like_btn',{'active':isSongLike}]"
              @click="userLike"
            ></div>
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
import xhtopbar from '@/components/topbar'
// import axios from 'axios'
import {mapState} from 'vuex'
import {getSongTimeStr, showToast} from '@/utils'

export default {

  data () {
    return {
      currentValue: 0,
      countValue: 0,
      controlValue: 0,
      isShowControlTime: false,
      isPlay: false,
      songInfo: {
        id: 0,
        title: 'X音乐',
        musicSrc: '',
        singer: '',
        imgSrc: 'https://6d75-music163-4rnnj-1300176346.tcb.qcloud.la/images/logo.png?sign=397dcb0bb7d46158211c61dc88373798&t=1568790260',
        lyric: '',
        size: 0
      },
      isSongLike: false,
      userId: '',
      likeList: [],
      maskBgImg: '',
      playTimer: null,
      playIndex: 0,
      playMode: 0, // 0:随机，1：顺序，2：重复
      limitClickTime: null, // 限制疯狂点击
      ShowControlTimer: null,
      needleTimer: null,
      timer: null,
      lyricMode: 'small'
    }
  },

  methods: {
    play (songid) {
      if (!songid) {
        return false
      }
      wx.showLoading({
        title: '正在获取数据',
        mask: true
      })
      return wx.cloud.callFunction({
        name: 'getSongInfo',
        data: {
          songid: songid
        }
      }).then(res => {
        let data = res.result
        this.songInfo = {
          id: data._id,
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
        this.$store.dispatch('setTabbarPlayInfo', {
          songImg: this.songInfo.imgSrc,
          isPlay: true
        })
        let strIndex = this.playRecord.indexOf(songid)
        if (strIndex >= 0) {
          this.playRecord = this.playRecord.substr(0, strIndex) + this.playRecord.substr(this.playRecord.indexOf(',', strIndex) + 1)
        }
        this.playRecord = songid + ',' + this.playRecord
        wx.setStorage({
          key: 'play_record',
          data: this.playRecord
        })
        if (this.isLogin && (new Date().getTime() - this.playTimes) >= 3600000) {
          let userInfo = Object.assign({}, this.userInfo, {integral: this.userInfo.integral + 1})
          this.$store.dispatch('setUserInfo', userInfo)
        }
        wx.hideLoading()
        return res
      }, err => {
        console.log(err)
        wx.hideLoading()
      })
    },
    pause () {
      this.audioManager.pause()
      this.isPlay = false
    },
    next () {
      if (this.limitClick()) {
        return false
      }
      if (this.playIndex < this.playList.length - 1) {
        this.playIndex++
      } else {
        this.playIndex = 0
      }
      this.$store.dispatch('setSongid', this.playList[this.playIndex]._id)
    },
    prev () {
      if (this.limitClick()) {
        return false
      }
      if (this.playIndex > 0) {
        this.playIndex--
      } else {
        this.playIndex = this.playList.length - 1
      }
      this.$store.dispatch('setSongid', this.playList[this.playIndex]._id)
    },
    seek (time) {
      if (time > 0) {
        this.audioManager.seek(time)
        this.$refs.lyric.findLyricIndex(time)
      }
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
      let isPlay = this.isPlay
      if (this.audioManager.paused || !isPlay) {
        if (this.audioManager.src && this.audioManager.src.length > 0) {
          this.audioManager.play()
          isPlay = true
        } else {
          this.$store.dispatch('setSongid', this.playList[this.playIndex]._id)
          return true
        }
      } else {
        this.pause()
        isPlay = false
      }
      this.isPlay = isPlay
      this.$store.dispatch('setTabbarPlayInfo', {
        songImg: this.songInfo.imgSrc,
        isPlay: isPlay
      })
    },
    limitClick () {
      let time = new Date().getTime()
      if ((time - this.limitClickTime) <= 2000) {
        this.limitClickTime = time
        wx.showToast({
          title: '亲！慢慢来~',
          icon: 'none'
        })
        clearTimeout(this.timer)
        this.timer = clearTimeout(() => {
          wx.hideToast()
        }, 2000)
        return true
      }
      this.limitClickTime = time
      return false
    },
    lyricShowChange (status) {
      this.lyricMode = status
    },
    setMaskBgImg (e) {
      this.maskBgImg = this.songInfo.imgSrc
    },
    getSongList () {
      wx.showLoading({
        title: '正在获取数据',
        mask: true
      })
      return wx.cloud.callFunction({
        name: 'getSongList',
        data: {
          page: 0,
          type: 0
        }
      }).then(res => {
        let data = res.result.data
        this.$store.dispatch('setPlayList', data)
        wx.hideLoading()
      })
    },
    userLike () {
      if (this.songid.length <= 0) {
        return false
      }
      if (this.isSongLike) {
        for (let i in this.likeList) {
          if (this.likeList[i] === this.songid) {
            this.likeList.splice(i, 1)
            break
          }
        }
      } else {
        this.likeList.push(this.songid)
      }
      wx.cloud.callFunction({
        name: 'updateLikeList',
        data: {
          list: this.likeList
        }
      })
      this.isSongLike = !this.isSongLike
      return false
    }
  },

  components: {
    circularProgress,
    xhslider,
    lyric,
    xhtopbar
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
    },
    songid (value, oldValue) {
      this.isSongLike = false
      for (let i in this.likeList) {
        if (this.likeList[i] === value) {
          this.isSongLike = true
        }
      }
    }
  },

  computed: {
    ...mapState(['audioManager', 'topbarHeight', 'systemInfo', 'userInfo', 'isLogin']),
    playList () {
      let songid = this.$store.state.songid
      let playList = this.$store.state.playList
      if (songid && songid.length > 0) {
        for (let i in playList) {
          if (playList[i]._id === songid) {
            this.playIndex = i
            break
          }
        }
      }
      return playList
    },
    songid () {
      let songid = this.$store.state.songid
      if (songid && songid.length > 0) {
        this.play(songid)
      }
      return songid || ''
    },
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
    this.audioManager.onStop(() => {
      this.pause()
    })
    this.audioManager.onEnded(() => {
      this.next()
    })
    this.audioManager.onError((err) => {
      console.log(err)
      showToast({
        title: '数据获取失败,马上为您播放下一首'
      })
      let timer = setTimeout(() => {
        this.next()
        clearTimeout(timer)
      }, 1000)
    })
    this.audioManager.onNext(() => {
      this.next()
    })
    this.audioManager.onPrev(() => {
      this.prev()
    })
    if (this.playList.length <= 0) {
      this.getSongList()
    }
    wx.cloud.callFunction({
      name: 'updateLikeList'
    }).then(res => {
      this.userId = res.result.data[0]._id
      this.likeList = res.result.data[0].list
    })
    this.playRecord = wx.getStorageSync('play_record')
    this.playTimes = parseInt(wx.getStorageSync('play_times')) || 0
    if (this.playTimes <= 0) {
      this.playTimes = new Date().getTime()
      wx.setStorageSync('play_times', this.playTimes)
    }
  },

  onHide () {
    this.isPlay = false
  },

  onShow () {
    if (typeof (this.audioManager.paused) !== 'undefined' && !this.audioManager.paused) {
      this.isPlay = true
      this.currentValue = this.audioManager.currentTime
      this.$refs.lyric.findLyricIndex(this.currentValue)
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

.player_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  bottom: 0;
  left: 0;
  // 音乐播放状态
  &.played{
    .song_img{
      animation-play-state:running !important;
    }
    .play_btn_mask{
      display: none !important;
    }
  }
  &.clean_player_mode{
    .player_content_box{
      .controlTime{}
      .disc_box{
        display: none;
      }
      .play_btn_mask{
        display: none !important;
      }
    }
  }
  .player_mask{
    transition:background 1s ease-in;
    filter: blur(40PX);
    width: 160%;
    height: 160%;
    position: absolute;
    top: -30%;
    left: -30%;
    z-index: 1;
    background: no-repeat center 0;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .disc_box{
      width: 250px;
      height: 250px;
      margin: 30px auto 0 auto;
      border-radius: 50%;
      box-shadow: 0 4px 8px #222;
      border:2px solid rgba(255,255,255,0.8);
      position: relative;
      .song_img{
        animation: played 15s linear infinite;
        animation-play-state:paused;
        border-radius: 50%;
      }
      .controlTime{
        transform: display .5s ease-in;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 250px;
        text-align: center;
        background: rgba($color: #000, $alpha: 0.7);
        font-size: 20px;
        color: #fff;
        z-index: 4;
        border-radius: 50%;
      }
      .play_btn_mask{
        background: rgba($color: #000, $alpha: 0.7);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon_play{
          width: 60px;
          height: 60px;
        }
      }
    }
    .control_wrap{
      padding-bottom: 15px;
      width: 100%;
    }
    .play_control_btns{
      color: #fff;
      display: flex;
      justify-content: space-between;
      width: 260px;
      line-height: 32px;
      margin: 20px auto;
      .iconfont{
        font-size: 24px;
      }
      .play_btn{
        font-size: 32px;
        color:$main-color;
      }
      .like_btn{
        font-size: 22px;
        &.active{
          color: $main-color;
        }
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
  }
}
</style>
<style lang="scss">
.clean_player_mode .circular_progress{
  display: none;
}
.circular_progress{
  width: 280px;
  height: 280px;
  z-index: 0;
  position: absolute !important;
  top: -15px;
  left: -15px;
}
.xh_slider{
  width: 250px !important;
}
.topbar_wrap{
  line-height: 20px;
}
.song_text_info{
  max-width: 200px;
  p{
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .singer{
    font-size: 12px;
    color: rgba($color: #fff, $alpha: 0.8);
    margin-top: -20px;
  }
}
</style>