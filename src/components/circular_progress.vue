<template>
  <div class="circular_progress">
    <img :src="canvasImg" class="canvas_img"/>
    <canvas class="progress_bar" canvas-id="progress_bar">  </canvas> 
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {px2rpx} from '@/utils'
export default {
  data () {
    return {
      size: 50,
      canvasImg: ''
    }
  },
  props: {
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
      let size = this.size
      let halfSize = parseInt(size / 2)
      let borderWidth = px2rpx(this.borderWidth, this.systemInfo.windowWidth, true)
      let ctx = wx.createCanvasContext('progress_bar')
      ctx.setLineWidth(borderWidth)
      let gradient = ctx.createLinearGradient(2 * size, size, 0)
      gradient.addColorStop('0.8', '#fd4545')
      gradient.addColorStop('1.0', '#fd4545')
      ctx.setStrokeStyle(gradient)
      ctx.setLineCap('round')
      ctx.beginPath()
      ctx.arc(halfSize, halfSize, halfSize - borderWidth, 0, this.progressValue * Math.PI, false)
      ctx.stroke()
      ctx.draw()
      this.canvasToTempImage()
    },
    getWrapHeight (el) {
      let query = wx.createSelectorQuery()
      query.select(el).boundingClientRect()
      query.exec((res) => {
        this.size = res[0].height
      })
    },
    canvasToTempImage: function () {
      wx.canvasToTempFilePath({
        canvasId: 'progress_bar',
        success: (res) => {
          this.canvasImg = res.tempFilePath
        }
      })
    }
  },

  computed: {
    ...mapState(['systemInfo']),
    progressValue () {
      return (this.currentValue / this.countValue) * 2
    }
  },

  watch: {
    currentValue (value, oldValue) {
      if (value <= this.countValue) {
        this.drawProgress()
      }
    },
    size (value, oldValue) {
      this.drawProgress()
    }
  },

  created () {
    this.getWrapHeight('.circular_progress')
    this.drawProgress()
  }
}
</script>

<style lang='scss'>
  .circular_progress{
    min-width: 50px;
    min-height: 50px;
    position: relative;
    overflow: hidden;
    .progress_bar{
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      top:-10000px;
    }
    .canvas_img{
      width: 100%;
      height: 100%;
    }
  }
</style>