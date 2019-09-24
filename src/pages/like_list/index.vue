<template>
  <div class="layout">
    <div class="add_btn" @click="gotoIndex" v-show="likeList.length <= 0">添加歌曲</div>
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
      userId: '',
      likeList: [{}],
      songList: []
    }
  },

  methods: {
    gotoIndex () {
      wx.switchTab({
        url: '/pages/index/main'
      })
    },
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

  components: {
  },

  onShow () {
    wx.showLoading({
      title: '正在获取数据',
      mask: true
    })
    wx.cloud.callFunction({
      name: 'updateLikeList'
    }).then(res => {
      this.userId = res.result.data[0]._id
      this.likeList = res.result.data[0].list
      if (this.likeList <= 0) {
        wx.hideLoading()
        return false
      }
      wx.cloud.callFunction({
        name: 'getSongList',
        data: {
          ids: this.likeList
        }
      }).then(res => {
        this.songList = res.result.data
        wx.hideLoading()
      })
    })
  }
}
</script>

<style lang='scss' scoped>
.add_btn{
  width: 80%;
  height: 40px;
  border-radius: 20px;
  background-color: $main-color;
  color: #fff;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  position:absolute;
  bottom: 50%;
  left: 10%;
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
