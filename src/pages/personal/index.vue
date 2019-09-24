<template>
  <div class="layout">
    <div class="content_wrap">
      <img :src="localUserInfo.avatarUrl" class="avatar">
      <div class="nick_name iconfont icon-xiugai07" 
        v-show="!isShowInput"
        @click="switchNickNameInput($event,true)"
      >
        {{localUserInfo.nickName}}
      </div>
      <input type="text" class="nick_name" 
        v-model="localUserInfo.nickName" 
        v-show="isShowInput"
        :focus="isShowInput"
        maxlength="32"
        @blur="switchNickNameInput($event,false)"
      >
      <div class="gender_box input_box">
        <div 
          :class="['male','iconfont','icon-nan',{'active':localUserInfo.gender == 1}]"
          @click="changeGender($event,1)"
        >男</div>
        <div 
          :class="['female','iconfont','icon-nv',{'active':localUserInfo.gender == 2}]"
          @click="changeGender($event,2)"
        >女</div>
      </div>
      <div class="confirm_btn" @click="updateUserInfo">立即修改</div>
    </div>
  </div>
</template>

<script>
import { showToast } from '@/utils'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      isShowInput: false,
      localUserInfo: {}
    }
  },

  methods: {
    switchNickNameInput (e, value = false) {
      this.isShowInput = value
    },
    changeGender (e, value) {
      this.localUserInfo = Object.assign({}, this.localUserInfo, {gender: value})
    },
    updateUserInfo () {
      wx.showToast({
        title: '正在更新资料',
        icon: 'loading',
        mask: true
      })
      this.$store.dispatch('setUserInfo', this.localUserInfo).then(res => {
        showToast({
          title: '资料更新成功',
          icon: 'success',
          mask: true
        })
        let timer = setTimeout(() => {
          clearTimeout(timer)
          wx.navigateBack()
        }, 1000)
      })
    }
  },

  mounted () {
    this.localUserInfo = JSON.parse(JSON.stringify(this.userInfo))
  },

  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style lang='scss' scoped>
.layout{background-color: $main-color;padding: 80px 0 0 0;}
.content_wrap{
  border-radius: 10px 10px 0 0;
  min-height: 100%;
  background-color: #fff;
  position: relative;
  padding-top: 50px;
  box-sizing: border-box;
  .avatar{
    width: 60px;
    height: 60px;
    position: absolute;
    left: 50%;
    top: -30px;
    margin-left: -30px;
    border-radius: 50%;
    background-color: #fff;
    border: 2px solid #fff;
    display: block;
  }
  .nick_name{
    font-size: 18px;
    height: 30px;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
  }
  .input_box{
    border-top: 1px solid #f5f5f5;
    padding: 10px 0; 
    margin: 15px 0;
  }
  .gender_box{
    display: flex;
    justify-content: center;
    .iconfont{
      width: 75px;
      height: 30px;
      border-radius: 15px;
      background-color: #f5f5f7;
      color: #919091;
      text-align: center;
      line-height: 30px;
      margin: 0 10px;
      &::before{
        margin: 0 4px;
      }
    }
    .male.active{
      background-color: #72c7ff;
    }
    .female.active{
      background-color: #ff6687;
    }
    .active{
      color: #fff;
    }
  }
  .confirm_btn{
    width: 80%;
    height: 40px;
    border-radius: 20px;
    background-color: $main-color;
    color: #fff;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    position:absolute;
    bottom: 20px;
    left: 10%;
  }
}
</style>
