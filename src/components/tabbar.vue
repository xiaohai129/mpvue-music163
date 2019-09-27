<template>
  <div class="tabbar_wrap">
    <div class='decorative_line'>
      <div class='left line'></div>
      <div class='right line'></div>
    </div>
    <div class="tabbar_layout">
      <div :class="['tabbar_item',{'item_selected':selectIndex==0}]" @click='gotoPage($event,list[0].pagePath)'>
        <img class="item_icon" :src="list[0].iconPath"/>
        <img class="item_icon" :src="list[0].selectedIconPath"/>
        {{list[0].text}}
      </div>
      <div class='tabbar_item player-min' @click='gotoPage($event,list[1].pagePath)'>
        <img :class="['song_img',{'playing':(tabbarPlayInfo.isPlay && settings[1] == 1)}]" :src="tabbarPlayInfo.songImg"/>
      </div>
      <div :class="['tabbar_item',{'item_selected':selectIndex==2}]" @click='gotoPage($event,list[2].pagePath)'>
        <img class="item_icon" :src="list[2].iconPath"/>
        <img class="item_icon" :src="list[2].selectedIconPath"/>
        {{list[2].text}}
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      list: [{
        pagePath: '/pages/index/main',
        text: '发现',
        iconPath: '/static/tabs/icon_find_n.png',
        selectedIconPath: '/static/tabs/icon_find_a.png'
      }, {
        pagePath: '/pages/player/main'
      }, {
        pagePath: '/pages/mine/main',
        text: '我的',
        iconPath: '/static/tabs/icon_mine_n.png',
        selectedIconPath: '/static/tabs/icon_mine_a.png'
      }],
      selectIndex: 0,
      settings: []
    }
  },
  methods: {
    gotoPage (e, url) {
      wx.switchTab({
        url: url
      })
    }
  },
  computed: {
    ...mapState(['tabbarPlayInfo', 'settings'])
  },
  mounted () {
    let page = getCurrentPages()
    page = page[page.length - 1]
    for (let i in this.list) {
      let item = this.list[i]
      if (item.pagePath.indexOf(page.route) >= 0) {
        this.selectIndex = i
        break
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@keyframes playing {
  from{
    transform: rotate(0deg)
  }
  to{
    transform: rotate(360deg)
  }
}
.tabbar_wrap{
  width:100%;
  height:50px;
  background:rgba(255, 255, 255, 0.9);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 0px 4px #ccc;
}
.tabbar_layout{
  display: flex;
  justify-content: space-between;
  text-align: center;
  height: 100%;
  .tabbar_item{
    width: 33.33%;
    color: #9e9e9e;
    font-size: 12px;
    .item_icon{
      height: 25px;
      width: 25px;
      display: block;
      margin: 5px auto 0 auto;
      display: none;
      &:nth-of-type(1){
        display: block;
      }
    }
    &.item_selected{
      color: #000;
      .item_icon:nth-of-type(1){
        display: none;
      }
      .item_icon:nth-of-type(2){
        display: block;
      }
    }
    
  }
  .player-min{
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    flex-shrink: 0;
    position: absolute;
    top: 0;
    left: 50%;
    margin: -10px 0 0 -30px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -2px 3px #ccc;
    .song_img{
      width: 90%;
      height: 90%;
      border-radius: 50%;
      &.playing{
        animation: playing 15s linear infinite;
      }
    }
  }
}


</style>
