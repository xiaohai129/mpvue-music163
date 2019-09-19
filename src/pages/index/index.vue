<template>
  <div class="layout">
    <xhtopbar bgColor='#fd4545' autoHeight='true'>
      <div class="search_box" @click="gotoSearchPage">
        <div class="placeholder iconfont icon-sousuo">搜索</div>
      </div>
      <div class="tabbar_roll">
        <div class="tabbar_item_wrap">
          <div v-for="(item, index) in tabTextList" 
            :key="index"
            :class="['tabbar_item',{'active':tabIndex==index}]"
            @click="switchTab($event, index)"
          >{{item}}</div>
        </div>
        <div class="tabbar_underline" :style="{left:148*tabIndex+'rpx'}"></div>
      </div>
    </xhtopbar>
    <swiper class="tabbar_content" 
      :current="tabIndex"
      @change="tabChange"
    >        
      <swiper-item v-for="(config, index) in tabConfigs" :key="index">
        <scroll-view class="scroll_wrap" 
          scroll-y='true'
          @scrolltolower='getMoreData'
        >
          <div class="song_item" 
            v-for="(item, rank) in config.data" :key="rank"
            @click="playMusic($event, item._id)"
          >
            <span class="rank">{{rank+1}}</span>
            <img :src="item.imgSrc"/>
            <div class="text_wrap">
              <h2>{{item.title}}</h2>
              <p>{{item.singer}}</p>
            </div>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
    <xhtabbar />
  </div>
</template>

<script>
import xhtopbar from '@/components/topbar'
import xhtabbar from '@/components/tabbar'
import { CLASSIFYS } from '@/config'
export default {
  data () {
    return {
      tabTextList: CLASSIFYS,
      tabIndex: 0,
      tabConfigs: []
    }
  },
  components: {
    xhtabbar,
    xhtopbar
  },
  methods: {
    getSongList (type = this.tabIndex) {
      let config = this.tabConfigs[type]
      if (config.noData) {
        this.showToast({
          title: '无更多内容',
          icon: 'none',
          mask: true,
          time: 1000
        })
        return false
      }
      wx.showLoading({
        title: '正在获取数据',
        mask: true
      })
      return wx.cloud.callFunction({
        name: 'getSongList',
        data: {
          page: config.page,
          type: type
        }
      }).then(res => {
        let data = res.result.data
        if (data.length <= 0) {
          this.showToast({
            title: '无更多内容',
            icon: 'none',
            mask: false,
            time: 1000
          })
          config.noData = true
          return false
        }
        config.data = this.tabConfigs[type].data.concat(data)
        config.page++
        this.$nextTick(function () {
          wx.hideLoading()
        })
      }, err => {
        this.showToast({
          title: '数据获取失败',
          icon: 'none',
          mask: false,
          time: 1000
        })
        console.log(err)
      })
    },
    showToast (options) {
      wx.showToast({
        title: options.title,
        icon: options.icon,
        mask: options.mask
      })
      let timer = setTimeout(() => {
        clearTimeout(timer)
        wx.hideToast()
      }, options.time)
    },
    switchTab (e, index) {
      this.tabIndex = index
      return false
    },
    playMusic (e, id) {
      let playList = this.tabConfigs[this.tabIndex].data
      this.$store.dispatch('setPlayList', playList).then(res => {
        return this.$store.dispatch('setSongid', id)
      }).then(res => {
        wx.switchTab({
          url: '/pages/player/main'
        })
      })
    },
    tabChange (e) {
      let index = e.target.current
      this.tabIndex = index
      if (this.tabConfigs[index].data.length <= 0) {
        this.getSongList()
      }
    },
    getMoreData (e) {
      if (this.tabConfigs[this.tabIndex].noData) {
        this.showToast({
          title: '无更多内容',
          icon: 'none',
          mask: true,
          time: 1000
        })
        return false
      }
      this.getSongList()
    },
    gotoSearchPage () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    }
  },
  created () {
    for (let i in this.tabTextList) {
      this.tabConfigs.push({
        noData: false,
        data: [],
        type: i,
        text: this.tabTextList[i],
        page: 0
      })
    }
  },
  mounted () {
    this.getSongList()
  }
}
</script>
<style lang='scss' scoped>
.layout{
  padding:0;
}
.tabbar_roll{
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  .tabbar_item_wrap{
    display: flex;
    justify-content: left;
    .tabbar_item{
      width: 74px;
      height: 100%;
      text-align: center;
      position: relative;
      color:rgba($color: #fff, $alpha: 0.8);
      &:first-of-type::before{
        display: none;
      }
      &::before{
        display: block;
        width: 1PX;
        height: 40%;
        background-color:rgba($color: #fff, $alpha: 0.8);
        content: ' ';
        position: absolute;
        left: 0;
        top: 30%;
      }
      &.active{
        color:#fff;
      }
    }
  }
  .tabbar_underline{
    height: 4px;
    width: 50px;
    background-color: #fff;
    position: absolute;
    bottom: 4px;
    left: 0;
    margin: 0 12px;
    border-radius: 2px;
    transition:left .3s ease-out;
  }
}
.search_box{
  width: 94%;
  display: block;
  margin: 6PX auto 0 auto;
  flex-shrink: 0;
  color: rgba($color: #fff, $alpha: 0.8);
  padding-right: 100PX;
  box-sizing: border-box;
  .placeholder{
    width: 100%;
    height: 30PX;
    line-height: 30PX;
    background-color: rgba($color: #fff, $alpha: 0.2);
    border-radius: 15PX;
    font-size: 12px;
    &::before{
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      font-size: 14px;
    }
  }
}
.tabbar_content{
  padding-top: 100px;
  height: 100%;
  box-sizing: border-box;
  .scroll_wrap{
    height: 100%;
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
      }
      h2{
        font-size: 16px;
      }
      p{
        font-size: 12px;
        color: #999;
      }
      &:last-of-type{
        border: none;
        padding-bottom: 54PX;
      }
    }
  }
}

.content_wrap{
  background: #fff;
  padding-top: 100px;

}
</style>
