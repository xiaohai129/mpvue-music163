<template>
  <div class="layout">
    <div class="top_wrap">
      <div class="top_bg"></div>
      <div class="content">
        <img class="avatar" :src="userInfo.avatarUrl"/>
        <div class="userinfo">
          <p v-if="isLogin" class="nickName" >{{userInfo.nickName}}</p>
          <button v-else 
            open-type='getUserInfo' 
            class="getUserInfo_btn"
            @getuserinfo="getUserInfo"
          >请先登录
            <open-data type="userAvatarUrl"></open-data>
            <open-data type="userNickName"></open-data>
            <open-data type="userCity"></open-data>
          </button>
          <div class="integral_bar">
            <div class="current_value_bar"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_wrap">
      <div class="content">
        <div class="action_btns">
          <div class="item_btn">
            <img src="/static/images/mine/icon_like.png"/>
            <p>我的喜欢</p>
          </div>
          <div class="item_btn">
            <img src="/static/images/mine/icon_history.png"/>
            <p>播放记录</p>
          </div>
          <div class="item_btn">
            <img src="/static/images/mine/icon_download.png"/>
            <p>下载歌曲</p>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="list_item"><i class="iconfont icon-ziliao"></i>我的资料</div>
        <div class="list_item"><i class="iconfont icon-shezhi"></i>设置中心</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
    }
  },

  components: {
  },
  computed: {
    ...mapState(['userInfo', 'isLogin'])
  },
  methods: {
    getUserInfo (e) {
      let userInfo = e.target.userInfo
      this.$store.dispatch('setUserInfo', {
        avatarUrl: userInfo.avatarUrl,
        openid: this.userInfo.openid,
        nickName: userInfo.nickName,
        gender: userInfo.gender
      })
    }
  },
  created () {
    wx.showToast({
      title: '正在获取数据…',
      icon: 'loading',
      mask: true
    })
  },
  mounted () {
    this.$store.dispatch('login').then(res => {
      wx.hideToast()
    })
  },
  onShow () {
    this.$mp.page.getTabBar().updateTabbarStatus('mine')
  }
}
</script>

<style lang='scss' scoped>
.layout{
  overflow: hidden;
}
.top_wrap{
  position: relative;
  color: #fff;
  font-size: 14px;
  padding-bottom: 40px;
  .top_bg{
    background-color: $main-color;
    width: 160%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    z-index: 0;
    top: 0;
    left: -30%;
    min-height: 100px;
    &::before{
      width: 100%;
      height: 50%;
      background-color: $main-color;
      position: absolute;
      top: 0;
      left: 0;
      content: ' ';
    }
  }
  .content{
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: left;
    padding: 10px 0 0 20px;
    .avatar{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      position: relative;
      display: block;
    }
    .userinfo{
      padding-left: 10px;
      .nickName{
        font-size: 16px;
        font-weight: bold;
        margin-top: 5px;
      }
      .integral_bar{
        width: 150px;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        background-color: $second-color;
        box-shadow: 0 0 4px inset rgba($color: #fff, $alpha: 0.5);
        border: 2px solid $second-color;
        margin-top: 15px;
        position: relative;
        .current_value_bar{
          width: 10%;
          height: 100%;
          background-color: red;
          border-radius: 4px;
          position: absolute;
          left: 0;
          top: 0
        }
      }
      .getUserInfo_btn{
        width: 100px;
        height: 25px;
        margin: 0;
        border-radius: 15px;
        line-height: 25px;
        font-size: 14px;
        background-color: #ffffff;
        color: $main-color;
        box-shadow: 0 0 8px $second-color;
      }
    }
  }
}

.content_wrap{
  position: relative;
  top: -40px;
  margin: 0 10px;
  .content{
    background-color: #fff;
    padding: 10px 0;
    border-radius: 5px;
    margin-top: 10px;
    .action_btns{
      display: flex;
      justify-content: space-around;
      text-align: center;
      .item_btn{
        img{
          width: 35px;
          height: 35px;
        }
        p{
          font-size: 12px;
        }
      }
    }
    .list_item{
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      background:url('https://6d75-music163-4rnnj-1300176346.tcb.qcloud.la/images/icon_next.png?sign=39a78a1d6227fa33ef3b0a2a8a3d472f&t=1568620246') no-repeat 98% center;
      background-size: 12px 12px;
      padding: 0 10px;
      border-bottom: 1PX dashed rgba($color: #ccc, $alpha: .6);
      &:last-of-type{
        border-bottom: none;
      }
      .iconfont{
        display: inline-block;
        margin-right: 5px;
      }
    }
  }
  
}
</style>
