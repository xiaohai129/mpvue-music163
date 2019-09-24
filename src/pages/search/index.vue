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
        :focus='true'
      >
    </div>

    <div class="serching_list" v-show="isSearch">
      <div class="search_item" v-for="(item, index) in searchData.songs" 
        :key="index"
        @click="gotoSearchDetails($event,'song', index)"
      >
        <div class="left">
          <span class="prefix_text">搜索</span>
          {{item.title}}
        </div>
        <div class="right iconfont icon-sousuo"></div>
      </div>
      <div class="search_item" v-for="(item, index) in searchData.singers" 
        :key="index"
        @click="gotoSearchDetails($event,'singer',index)"
      >
        <div class="left">
          <span class="prefix_text">搜索</span>
          {{item.singer}}
        </div>
        <div class="right iconfont icon-sousuo"></div>
      </div>
      <div class="tips_text" v-show="isShowNoData">
        {{searchTipText}}
      </div>
    </div>

    <div v-show="!isSearch" class="searched_list">
      <div class="title"><span>搜索历史</span><span class="cleanup_btn" v-if="searchHistorys.length>0">清除历史</span></div>
      <div class="tips_text" v-if="searchHistorys.length<=0">
        暂无任何搜索记录
      </div>
      <div class="search_item" v-for="(item, index) in searchHistorys" 
        :key="index"
        @click="fastSearch($event,item)"
      >
        <div class="left">
          {{item}}
        </div>
        <div class="right iconfont icon-cha" @click="deleteHistoryItem($event, index)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keywords: '',
      searchTimer: null,
      searchData: {
        songs: [],
        singers: []
      },
      searchHistorys: [],
      searchTipText: '无匹配数据'
    }
  },

  components: {
  },
  methods: {
    gotoSearchDetails (e, type, dataIndex) {
      let keywords, datas
      if (type === 'song') {
        let data = this.searchData.songs[dataIndex]
        keywords = data.title
        datas = data._id
      } else if (type === 'singer') {
        let data = this.searchData.singers[dataIndex]
        keywords = data.singer
        datas = data.list.join(',')
      }
      this.searchHistorys.map((item, index) => {
        if (item === keywords) {
          this.searchHistorys.splice(index, 1)
          return true
        }
      })
      this.searchHistorys = [keywords].concat(this.searchHistorys)
      wx.setStorageSync('searchHistorys', this.searchHistorys.join(','))
      if (keywords && datas) {
        this.keywords = ''
        wx.navigateTo({
          url: '/pages/search_details/main?keywords=' + keywords + '&type=' + type + '&data=' + datas
        })
      }
    },
    fastSearch (e, value) {
      this.keywords = value
    },
    deleteHistoryItem (e, dataIndex) {
      this.searchHistorys.splice(dataIndex, 1)
      if (this.searchHistorys.length <= 0) {
        wx.removeStorageSync('searchHistorys')
      } else {
        wx.setStorageSync('searchHistorys', this.searchHistorys.join(','))
      }
      return false
    }
  },
  watch: {
    keywords (value, oldValue) {
      this.searchTipText = '正在加载…'
      clearTimeout(this.searchTimer)
      if (value.length <= 0) {
        this.searchData = {
          songs: [],
          singers: []
        }
        return false
      }
      this.searchTimer = setTimeout(() => {
        wx.cloud.callFunction({
          name: 'searchInfo',
          data: {
            keywords: value
          }
        }).then(res => {
          this.searchData = res.result
          if (this.searchData.songs.length <= 0 && this.searchData.singers.length <= 0) {
            this.searchTipText = '无匹配数据'
          } else if (this.searchData.songs.length <= 0 || this.searchData.singers.length <= 0) {
            if (this.searchData.songs.length === 1) {
              this.gotoSearchDetails(null, 'song', 0)
            } else if (this.searchData.singers.length === 1) {
              this.gotoSearchDetails(null, 'singer', 0)
            }
            return false
          }
        })
      }, 500)
    }
  },
  computed: {
    isShowNoData () {
      return this.searchData.songs.length <= 0 && this.searchData.singers.length <= 0
    },
    isSearch () {
      return this.keywords.length > 0
    }
  },
  created () {
    let historyData = wx.getStorageSync('searchHistorys')
    if (historyData.length <= 0) {
      this.searchHistorys = []
    } else {
      this.searchHistorys = historyData.split(',')
    }
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
    line-height: 38PX;
  }
  .input_box{
    width: 96%;
    height: 36PX;
    line-height: 36PX;
    background-color: rgba($color: #fff, $alpha: 0.2);
    border-radius: 15PX;
    font-size: 14px;
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
  .search_item .right{
    color: rgba($color: #000000, $alpha: 0.3);
    width: 90px;
    text-align: right;
    padding-right: 20px;
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
.tips_text{
  font-size: 14px;
  color: #666;
  line-height: 240px;
  text-align: center;
}
</style>
<style>
.input-placeholder{
  color: rgba(255,255,255,0.8);
}
</style>
