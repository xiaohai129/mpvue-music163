<script>
export default {
  created () {
    this.$store.dispatch('getSystemInfo')
    this.$store.dispatch('getAudioManager')
    this.$store.dispatch('getTopbarHeight')
    wx.setStorageSync('songImg', '/static/images/player/disc_default.png')
  },
  mounted () {
    wx.hideTabBar()
  }
}
</script>
<style lang='scss'>
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_1393436_3kd9vqi7qm7.eot?t=1568364250417'); /* IE9 */
  src: url('//at.alicdn.com/t/font_1393436_3kd9vqi7qm7.eot?t=1568364250417#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAATYAAsAAAAAClAAAASLAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDZAqGeIVJATYCJAMgCxIABCAFhG0HehvFCBGVnGHJvjjgTayTEUqaOCtxAuHv2KZP7RYmEiTuFfz37XX3zc7un7TqElUpsjbPQSEUHt+FREqMRpjEyO8D72mvyQCyOwDpaB7sP6EBAgjEbk01ScdGBUSAeMLQLj65/MufH/Lp5SxehotQAWwBa+pBy//PMePV89kwv81GMtOsokjaG44ieUDRV4HXdnTAd3TPT5humF7CQF5+GAI0MYcWaE4uXkFgg8PZJ4B2bU+JB1tJCe/BCiEpLRcyQcVgRhA5xCWA3/jn9REGNDZgyCScRz3TnZNg94Z4O0dS/ylRZA4y19MD7DJIgEMAB6Jaje8g0+AhSDSNpzHhCaCNgMHfkG/E3ki9KXs79/8/W6KEnOU6YaGNrvsvHlQoMAgZCQ7EAihsY8xrqAJbwmcaIhLKKVAkBgX0iaSgHEFRGaQgg90sBQns5thPTBjhBX2ADhA7kCMc8VVcKAgOwdxlYjxCktKKQjw8fALg0/fSU6oYIgGVnUJJ5UJ+5dXCyRV5ooFVdSfvJCT0zouxNMyoHuxj7GSiunNFQjhye2k0Rh8nZ2hVXk9wD7VsVF6VMaowro5RW8noKMkTnghdoW4FsW2qXaJzdxl3LCpVOiHN7dDbcVVVol2qV2WGT6dKZaWIrLjVb09u3JZnar7ltHlHgbnt7t7STUM5OnslmOv6VDk7esSZqrsjU/o21GuQ7phXylWhdzZKVp1sFSuNig1L6t7UqKWhL7Kkmqec3NEgVn5N38PPLSiEn96bDLp3RJzTXDCNXtWYzE+fDaHh9Pqwl57sVNTj5y94Confg5c2yqzwPJWZm188u7HhVCTnnvR5p7K3yxaTb7lg63ZaWp+Vm5+LY+Hn7w65jt8/Fzi4+bhZ9aWOK5wq9TthLxnP3HMjQbGBTHMVrzBVL/XMATFBLn4ulnixqoDJKvLBsclEzXiW2jIBCb07+hFctfZUqaev5YosKcUFRskTNTand1eAS8B3k2e/h4eogGgg2Z90l6ZVd+GyjMq+L6z+rF/2xX9/MdWhS2WL3RDV5Tn6TESyU1w7b80VhgLPxqw8CwB1do80hx+DrCJzAEj5xE0A9IJoAerJPckDIBUTL4C5iHj2M27jZ5XtXiyv1de4edZ9/y1HHyBnzWGL9ZzBEBV+PdbIJjc5jiqmq/OVaC3RWyEOA023A34669DfmuLJ6HSQMMnBVGaQhAXCMYeQtRxBEW6h6cDL5S0j7ITWAPZ9AZC+bzBdf5D0/SAc8wvZ1D8U/Uhoeun+hi2rtl8/sEExGoYDeEXZehq5TjJfjZsjcpET4z8NF++Brm6rkReTDa9xomxdL2LBMiV4Bo8zMRJMTBujpB5FpnXT2LYPqhWlxbVHzEDC0MDgAHgKyWzYW1zXvv+V4cwixD1lDepPBiv84qBTa0cgXoR5VNmzrC62nJ4QFu+yGEnAM9Qb0Q0SMLVv2jAUURtn+CdrDWpnxwrr/cXpTo8BTc6bRKYkV1ZRpVADP6pwPpDF7G4PPkefzFUO6a7Am0P9xREvz5/dTRmrsoOPUmi+2ntMFYsFAA==') format('woff2'),
  url('//at.alicdn.com/t/font_1393436_3kd9vqi7qm7.woff?t=1568364250417') format('woff'),
  url('//at.alicdn.com/t/font_1393436_3kd9vqi7qm7.ttf?t=1568364250417') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('//at.alicdn.com/t/font_1393436_3kd9vqi7qm7.svg?t=1568364250417#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-back:before {
  content: "\e61c";
}

.icon-bofang:before {
  content: "\e618";
}

.icon-yinliang-gao:before {
  content: "\e7ba";
}

.icon-yinliang-guan:before {
  content: "\e7bb";
}

.icon-zanting:before {
  content: "\e693";
}

.icon-shangyishou:before {
  content: "\e603";
}

.icon-xiayishou:before {
  content: "\e602";
}

  page,.layout{height: 100%;}
  img{width: 100%;height: 100%;}
</style>
