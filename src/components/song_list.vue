<template>
  <cover-view :class="['wrap',{'active':isShow,'delayShow':delayShow}]" @click="close">
  <cover-view class="mask"></cover-view>
  <cover-view class="songlist_wrap">
      <cover-view class="title">播放列表</cover-view>
      <cover-view class="scroll_box">
        <cover-view class="song_info" v-for="(item, index) in songList" :key="index" @click="playMusic($event,item._id)">
          <cover-view class="text_box">
            <cover-view class="rank">{{index+1}}</cover-view>
            <cover-view class="info_wrap">
              <cover-view class="name">{{item.title}}</cover-view>
              <cover-view class="singer">{{item.singer}}</cover-view>
            </cover-view>
          </cover-view>
          <cover-view class="time">
            {{times[index]}}
          </cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
import {getSongTimeStr} from '@/utils'
export default {
  data () {
    return {
      times: [],
      isShow: false,
      delayShow: false
    }
  },
  props: ['songList'],
  methods: {
    close () {
      if (this.delayShow === false) {
        return false
      }
      this.delayShow = false
      setTimeout(() => {
        this.isShow = false
      }, 500)
    },
    playMusic (e, id) {
      console.log(id)
      return this.$store.dispatch('setSongid', id)
    }
  },
  watch: {
    songList (value, oldValue) {
      let times = []
      for (let i in value) {
        times.push(getSongTimeStr(value[i].size))
      }
      this.times = times
    }
  },
  created () {
    this.$on('show', () => {
      if (this.isShow) {
        return false
      }
      this.isShow = true
      setTimeout(() => {
        this.delayShow = true
      }, 500)
    })
  }
}
</script>

<style lang='scss' scoped>
.wrap{
  position: fixed;
  bottom: 0;
  left: 0;
  display: none;
  height: 100%;
  width: 100%;
  z-index: 50;
  .mask{
    height: 100%;
    width: 100%;
    background-color: rgba($color: #000, $alpha: 0.5);
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.5s ease-in;
  }
  &.active{
    display: block;
  }
  &.delayShow{
    .mask{
      opacity: 1;
    }
    .songlist_wrap{
      bottom: 0;
    }
  }
}
.songlist_wrap{
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  max-height: 500px;
  background-color: #fff;
  z-index: 100;
  position: absolute;
  width: 100%;
  bottom: -100%;
  left: 0;
  padding-bottom: 10px;
  transition: bottom 0.5s ease-in;
  .title{
    font-size: 18px;
    padding: 10px;
  }
  .scroll_box{
    max-height: 400px;
    overflow-y: auto;
  }
  .song_info{
    display: flex;
    justify-content: space-between;
    height: 40px;
    font-size: 14px;
    margin-left: 10px;
    border-bottom: 1px solid #eee;
    cover-view{
      line-height: 40px;
    }
    .text_box{
      display: flex;
      justify-content: left;
    }
    .rank{
      font-size: 12px;
      color: rgba($color: #000, $alpha: 0.8);
      width: 50px;
      text-align: center;
    }
    .info_wrap{
      display:flex;
      justify-content: left;
      flex-wrap: wrap;
      align-items: center;
      flex-shrink: 0;
      flex-grow: 0;
      max-width: 240px;
    }
    .name{
      line-height: 15px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      padding-right: 10px;
      flex-shrink: 0;
      flex-grow: 0;
      max-width: 240px;
    }
    .singer{
      font-size: 10px;
      color: rgba($color: #000, $alpha: 0.6);
      line-height: 15px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      padding-right: 10px;
      flex-shrink: 0;
      flex-grow: 0;
      max-width: 240px;
    }
    .time{
      padding-right: 10px;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.8);
    }
    &:last-of-type{
      border: none;
    }
  }
}
</style>