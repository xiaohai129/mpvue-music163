<template>
  <div class="lyric_wrap">
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
      lyricIndex: 1
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
        aLyric.push(oTemp)
      }
      this.lyricArr = aLyric
    }
  },
  watch: {
    currentTime (value, oldValue) {
      if (this.lyricIndex >= this.lyricArr.length) {
        return false
      }
      let sTime = this.lyricArr[this.lyricIndex].time
      let aTime = sTime.split(':')
      let tempTime = (parseInt(aTime[0]) * 60) + parseFloat(aTime[1])
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
      return (-this.lyricIndex * 28) + 'px'
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
  }
</style>