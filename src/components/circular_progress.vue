<template>
  <div class="circular_progress">
    <canvas class="progress_bar" canvas-id="progress_bar">  </canvas> 
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {px2rpx} from '@/utils'
export default {
  props: {
    size: {
      type: Number,
      default: 200
    },
    borderWidth: {
      type: Number,
      default: 3
    },
    currentValue: {
      type: Number,
      default: 0
    },
    countValue: {
      type: Number,
      default: 1
    }
  },

  methods: {
    drawProgress () {
      if (!this.progressValue) {
        return false
      }
      let size = this.sizeRpx
      let halfSize = parseInt(size / 2)
      let borderWidth = px2rpx(this.borderWidth, this.systemInfo.windowWidth, true)
      let ctx = wx.createCanvasContext('progress_bar')
      ctx.setLineWidth(borderWidth)
      let gradient = ctx.createLinearGradient(2 * size, size, 0)
      gradient.addColorStop('0', '#fff')
      gradient.addColorStop('1.0', '#fdf2f2')
      ctx.setStrokeStyle(gradient)
      ctx.setLineCap('round')
      ctx.beginPath()
      ctx.arc(halfSize, halfSize, halfSize - borderWidth, 0, this.progressValue * Math.PI, false)
      ctx.stroke()
      ctx.draw()
    },
    getWrapHeight (el) {
      const query = wx.createSelectorQuery()
      query.select(el).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        console.log(res)
      })
    }
  },

  computed: {
    ...mapState(['systemInfo']),
    sizeRpx () {
      return px2rpx(this.size, this.systemInfo.windowWidth, true)
    },
    progressValue () {
      return (this.currentValue / this.countValue) * 2
    }
  },

  watch: {
    currentValue (value, oldValue) {
      if (value <= this.countValue) {
        this.drawProgress()
      }
    }
  },

  created () {
    this.getWrapHeight()
    this.drawProgress('.circular_progress')
  }
}
</script>

<style lang='scss'>
  .circular_progress{
    min-width: 50px;
    min-height: 50px;
    .progress_bar{
      width: 100%;
      height: 100%;
    }
  }
</style>