<template>
  <div class="layout">
    <div class="search_box">
      <div class="iconfont icon-sousuo"></div>
      <input class="input_box" 
        type="text" 
        confirm-type="search" 
        maxlength="36" 
        placeholder="搜索歌名、歌手" 
        placeholder-class="placeholder"
        v-model="keywords"
      >
    </div>

    <div class="serching_list" v-show="keywords.length>0">
      <div class="title">
        搜索"{{keywords}}"
      </div>
      <div class="search_item">
        <div class="left">
          <span class="prefix_text">搜索</span>
          12121
        </div>
        <div class="right iconfont icon-sousuo"></div>
      </div>
    </div>

    <div v-show="keywords.length <= 0" class="searched_list">
      <div class="title"><span>搜索历史</span><span class="cleanup_btn">清除历史</span></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keywords: '',
      searchTimer: null
    }
  },

  components: {
  },

  methods: {
  },
  watch: {
    keywords (value, oldValue) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        wx.cloud.callFunction({
          name: 'searchInfo',
          data: {
            keywords: value
          }
        }).then(res => {
          console.log(res)
        })
      }, 500)
    }
  },

  created () {
  }
}
</script>

<style lang='scss' scoped>
.search_box{
  width: 100%;
  display: block;
  flex-shrink: 0;
  color: rgba($color: #fff, $alpha: 0.8);
  padding-right: 100PX;
  box-sizing: border-box;
  background-color: $main-color;
  padding: 6px 0;
  position: relative;
  .iconfont{
    position: absolute;
    left: 3%;
    width: 30px;
    text-align: center;
    line-height: 32PX;
  }
  .input_box{
    width: 96%;
    height: 30PX;
    line-height: 30PX;
    background-color: rgba($color: #fff, $alpha: 0.2);
    border-radius: 15PX;
    font-size: 12px;
    text-align: left;
    margin: 0 auto;
    padding-left: 30px;
    box-sizing: border-box;
    &::before{
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      font-size: 14px;
    }
  }
}
.searched_list{
  padding-left: 10px;
  .title{
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    padding-right:10px;
    height: 40px;
    line-height: 40px;
    .cleanup_btn{
      display: block;
      color: $main-color;
      height: 100%;
      width: 80px;
      text-align: center;
    }
  }
}
.serching_list{
  padding-left: 10px;
  .title{
    font-size: 14px;
    padding-right:10px;
    height: 40px;
    line-height: 40px;
    color: $main-color;
  }
}
.search_item{
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  font-size: 12px;
  .left{
    .prefix_text{
      padding-right: 10px;
      color: rgba($color: #000000, $alpha: 0.6)
    }
  }
  .right{
    width: 30px;
    color: rgba($color: #000000, $alpha: 0.6)
  }
}
</style>
<style>
.input-placeholder{
  color: rgba(255,255,255,0.8);
}
</style>
