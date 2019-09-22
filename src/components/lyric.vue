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
      let lyricArr = this.lyric.split('↵')
      let lyricList = []
      let item, times, num, lyric, i, j
      for (i in lyricArr) {
        item = lyricArr[i]
        times = item.match(/(\d*:\d*)/g)
        lyric = item.substr(item.lastIndexOf(']') + 1)
        for (j in times) {
          num = this.getTimeValue(times[j])
          if (isNaN(num)) {
            break
          }
          lyricList.push({
            time: this.getTimeValue(times[j]),
            text: lyric
          })
        }
      }
      this.lyricIndex = 0
      this.lyricArr = lyricList.sort(this.lyricTimeCompare)
    },
    lyricTimeCompare (obj1, obj2) {
      let time1 = obj1.time
      let time2 = obj2.time
      if (time1 < time2) {
        return -1
      } else if (time1 > time2) {
        return 1
      } else {
        return 0
      }
    },
    findLyricIndex (time) {
      if (!this.lyricArr[this.lyricIndex]) {
        return false
      }
      if (this.lyricIndex >= this.lyricArr.length) {
        this.lyricIndex--
      }
      let currentTime = this.lyricArr[this.lyricIndex].time
      let direction = 1
      if (currentTime > time) {
        direction = -1
      }
      let currentIndex = this.lyricIndex
      let isFind = false
      while (!isFind && (currentIndex >= 0 && currentIndex < this.lyricArr.length)) {
        currentTime = this.lyricArr[currentIndex].time
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
      if (this.lyricArr[this.lyricIndex]) {
        let sTime = this.lyricArr[this.lyricIndex].time
        if (value + 0.4 > sTime) {
          this.lyricIndex++
        }
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
      height: calc(100% - 200px);
      margin: 40px 0 0 0;
    }
  }
</style>