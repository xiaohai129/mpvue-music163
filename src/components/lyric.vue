<template>
  <div :class="['lyric_wrap',showStatus=='full'?'full_lyric_wrap':'']" @click="showModeSwitch">
    <ul class="lyric_list" :style="{top:topValue}">
      <li v-for="(item, index) in lyricArr" :key="index" time :class="(lyricIndex-1)==index?'current':''">
        {{item.text}}
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      lyricArr: [{
        time: '',
        text: 'X音乐'
      }, {
        time: '',
        text: '欢迎您'
      }],
      lyricIndex: 1,
      showStatus: 'small' // small:小模式  full:全屏模式
    }
  },
  props: {
    lyric: {
      type: String
    },
    currentTime: {
      type: String
    }
  },
  methods: {
    getFormatTime (value) {
      let odate = new Date(value)
      return `${odate.getMinutes()}:${odate.getSeconds()}.${odate.getMilliseconds()}`
    },
    getTimeValue (value) {
      let aTime = value.split(':')
      return (parseInt(aTime[0]) * 60) + parseFloat(aTime[1])
    },
    getLyricInfo () {
      this.lyricIndex = 0
      this.lyricArr = []
      let sArr = this.lyric.split('↵')
      let aLyric = []
      for (let i in sArr) {
        let oTemp = {}
        let tIndex = sArr[i].indexOf(']')
        oTemp.time = sArr[i].substr(1, tIndex - 1)
        oTemp.text = sArr[i].substr(tIndex + 1)
        if (oTemp.time.length > 0) {
          aLyric.push(oTemp)
        }
      }
      this.lyricArr = aLyric
    },
    findLyricIndex (time) {
      if (this.lyricIndex >= this.lyricArr.length) {
        this.lyricIndex--
      }
      let currentTime = this.lyricArr[this.lyricIndex].time
      let direction = 1
      if (this.getTimeValue(currentTime) > time) {
        direction = -1
      }
      let currentIndex = this.lyricIndex
      let isFind = false
      while (!isFind && (currentIndex >= 0 && currentIndex < this.lyricArr.length)) {
        currentTime = this.getTimeValue(this.lyricArr[currentIndex].time)
        if (direction === 1 && currentTime > time) {
          isFind = true
          this.lyricIndex = currentIndex
        } else if (direction === -1 && currentTime < time) {
          isFind = true
          this.lyricIndex = currentIndex
        } else {
          currentIndex += direction
        }
      }
      if (!isFind) {
        this.lyricIndex = currentIndex
      }
    },
    showModeSwitch () {
      if (this.showStatus === 'small') {
        this.showStatus = 'full'
      } else {
        this.showStatus = 'small'
      }
      this.$emit('change', this.showStatus)
    }
  },
  watch: {
    currentTime (value, oldValue) {
      if (this.lyricIndex >= this.lyricArr.length) {
        return false
      }
      let sTime = this.lyricArr[this.lyricIndex].time
      let tempTime = this.getTimeValue(sTime)
      if (value > tempTime) {
        this.lyricIndex++
      }
    },
    lyric (value, oldValue) {
      this.getLyricInfo()
    }
  },
  computed: {
    ...mapState(['systemInfo']),
    topValue () {
      if (this.showStatus === 'small') {
        return (-this.lyricIndex * 28) + 'px'
      } else {
        return ((-this.lyricIndex + 4) * 28) + 'px'
      }
    }
  }
}
</script>

<style lang='scss'>
  .lyric_wrap{
    text-align: center;
    color: rgba($color: #fff, $alpha: 0.6);
    font-size: 12px;
    width: 100%;
    height: 76PX;
    overflow: hidden;
    position: relative;
    margin: 10px 0;
    .lyric_list{
      position: absolute;
      width: 100%;
      padding-top: 56PX;
      transition: top 0.2s ease-in;
      li{
        line-height: 28PX;
        height: 28PX;
        overflow: hidden;
      }
      .current{
        color: #fff;
        font-size: 16PX;
        text-shadow: 0 0 2px #000;
      }
    }
    &.full_lyric_wrap{
      position: absolute;
      top: 0;
      left: 0;
      height: calc(100% - 165px);
      margin: 0;
    }
  }
</style>