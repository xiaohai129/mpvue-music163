Component({
  properties: {

  },
  data: {
    isShow: true,
    list: [{
      pagePath: '/pages/index/main',
      text: '发现',
      iconPath: '/static/tabs/icon_find_n.png',
      selectedIconPath: '/static/tabs/icon_find_a.png'
    }, {
      pagePath: '/pages/player/main'
    },{
      pagePath: '/pages/mine/main',
      text: '我的',
      iconPath: '/static/tabs/icon_mine_n.png',
      selectedIconPath: '/static/tabs/icon_mine_a.png'
    }],
    selectIndex: 0,
    songImg:'',
    isPlay:false
  },
  methods: {
    gotoPage (e) {
      let index = parseInt(e.currentTarget.dataset.index)
      wx.switchTab({
        url:this.data.list[index].pagePath
      })
    },
    updateTabbarStatus (name) {
      let index = 0
      for (let i in this.data.list) {
        let item = this.data.list[i]
        if (item.pagePath.includes(name)) {
          index = i
        }
      }
      let songImg = wx.getStorageSync('songImg')
      let isPlay = !songImg.includes('disc_default')
      let isShow = true
      if (index == 1){
        isShow = false
      }
      this.setData({
        songImg: songImg,
        isPlay: isPlay,
        selectIndex: index,
        isShow: isShow
      })
    }
  },
  attached () {
    this.updateTabbarStatus()
  }
})
