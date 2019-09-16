<template>
  <div class="layout">
    <div class="tabbar_roll">
      <div class="tabbar_item_wrap">
        <div :class="['tabbar_item',{'active':tabIndex==0}]" @click="switchTab($event, 0)">推荐</div>
        <div :class="['tabbar_item',{'active':tabIndex==1}]" @click="switchTab($event, 1)">排行榜</div>
      </div>
      <div class="tabbar_underline" :style="{left:148*tabIndex+'rpx'}"></div>
    </div>
    <div class="content_wrap content_recommend" :style="{display:tabIndex==0?'block':'none'}">
      <div class="song_list">
        <div class="song_item" 
          v-for="(item, index) in songList" :key="index"
          @click="playMusic($event, item._id)"
        >
          <span class="rank">{{index+1}}</span>
          <img :src="item.imgSrc"/>
          <div class="text_wrap">
            <h2>{{item.title}}</h2>
            <p>{{item.singer}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="content_wrap" :style="{display:tabIndex==1?'block':'none'}">
      
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      songList: [],
      tabIndex: 0
    }
  },
  components: {
  },
  methods: {
    getSongList () {
      return wx.cloud.callFunction({
        name: 'getSongList'
      }).then(res => {
        this.songList = res.result.data
      })
    },
    switchTab (e, index) {
      this.tabIndex = index
      return false
    },
    playMusic (e, id) {
      this.$store.dispatch('setSongid', id).then(res => {
        wx.switchTab({
          url: '/pages/player/main'
        })
      })
    }
  },
  mounted () {
    wx.showToast({
      title: '正在获取数据…',
      icon: 'loading',
      mask: true
    })
    this.getSongList().then(res => {
      this.$nextTick(function () {
        wx.hideToast()
      })
    })
  },
  onShow () {
    this.$mp.page.getTabBar().updateTabbarStatus('index')
  }
}
</script>

<style lang='scss' scoped>
.layout{
  background-color: #fff;
}
.tabbar_roll{
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  background: #fff;
  border-bottom: 6px solid #eee;
  .tabbar_item_wrap{
    display: flex;
    justify-content: left;
    .tabbar_item{
      width: 74px;
      height: 100%;
      text-align: center;
      position: relative;
      &:first-of-type::before{
        display: none;
      }
      &::before{
        display: block;
        width: 1PX;
        height: 40%;
        background-color: #ccc;
        content: ' ';
        position: absolute;
        left: 0;
        top: 30%;
      }
      &.active{
        color: $main-color;
      }
    }
  }
  .tabbar_underline{
    height: 4px;
    width: 50px;
    background-color: $main-color;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 0 12px;
    border-radius: 2px;
    transition:left .3s ease-out;
  }
}

.content_wrap{
  background: #fff;
}
.content_recommend{
  .song_list{
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
      }
      img{
        width: 45px;
        height: 45px;
        margin-right: 10px;
      }
      h2{
        font-size: 16px;
      }
      p{
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>
