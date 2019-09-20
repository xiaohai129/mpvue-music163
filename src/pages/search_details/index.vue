<template>
  <div class="layout">
    <div class="title">
      <p v-if="searchInfo.type == 'song'">为您找到关于"{{searchInfo.keywords}}"的歌曲</p>
      <p v-else-if="searchInfo.type == 'singer'">为您找到歌手"{{searchInfo.keywords}}"的歌曲</p>
    </div>
    <div class="song_item" 
      v-for="(item, rank) in songList" :key="rank"
      @click="playMusic($event, item._id)"
    >
      <span class="rank">{{rank+1}}</span>
      <img :src="item.imgSrc"/>
      <div class="text_wrap">
        <h2>{{item.title}}</h2>
        <p>{{item.singer}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      songList: [],
      searchInfo: {}
    }
  },

  components: {
  },

  methods: {
    playMusic (e, id) {
      this.$store.dispatch('setPlayList', this.songList).then(res => {
        return this.$store.dispatch('setSongid', id)
      }).then(res => {
        wx.switchTab({
          url: '/pages/player/main'
        })
      })
    }
  },

  created () {

  },
  mounted () {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const options = currentPage.options
    this.searchInfo = {
      type: options.type,
      keywords: options.keywords
    }
    this.searchType = options.type

    wx.cloud.callFunction({
      name: 'getSongList',
      data: {
        ids: options.data.split(',')
      }
    }).then(res => {
      this.songList = res.result.data
    })
  }
}
</script>

<style lang='scss' scoped>
.title{
  background-color: $main-color;
  font-size: 14px;
  color: #fff;
  padding-left: 10px;
  line-height: 30px;
}
.song_item{
  display: flex;
  justify-content: left;
  align-items: center;
  overflow: hidden;
  padding:5px 10px 5px 0;
  border-bottom: 1PX dashed rgba($color: #ccc, $alpha: 0.6);
  .rank{
    font-size: 12px;
    color: #999;
    width: 30px;
    display: inline-block;
    text-align: center;
    flex-shrink: 0;
  }
  img{
    width: 45px;
    height: 45px;
    margin-right: 10px;
    flex-shrink: 0;
    background-color: #ddd;
  }
  h2{
    font-size: 16px;
  }
  p{
    font-size: 12px;
    color: #999;
  }
  &:first-of-type{
    padding-top: 14px;
  }
  &:last-of-type{
    border: none;
    padding-bottom: 54PX;
  }
}
</style>
