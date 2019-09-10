<template>
  <div class="wrap" @touchmove='setCurrentValue'>
    <div class="slider_wrap xh_slider" :style="{height:height+'rpx'}">
      <div class="round_block" :style="{left:cvalue+'%'}"></div>
      <div class="current_value" :style="{width:cvalue+'%'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      countValue: 1,
      currentValue: 0,
      width: 0
    }
  },

  props: {
    height: {
      type: Number,
      default: 6
    },
    onChange: {
      type: Function
    }
  },

  created () {
    this.getWrapHeight()
  },

  methods: {
    setCurrentValue (e, value) {
      if (value) {
        this.currentValue = value
      } else {
        let currentValue = this.countValue / this.width * (e.clientX - e.currentTarget.offsetLeft)
        if (currentValue > this.countValue || currentValue < 0) {
          return false
        }
        if (this.onChange) {
          this.onChange(currentValue)
        }
        this.currentValue = currentValue
      }
    },
    getWrapHeight () {
      let query = wx.createSelectorQuery()
      query.select('.slider_wrap').boundingClientRect()
      query.exec((res) => {
        this.width = res[0].width
      })
    }
  },

  computed: {
    cvalue () {
      return this.currentValue / this.countValue * 100
    }
  }
}
</script>

<style lang='scss' scoped>
.wrap{
  padding: 20px 0;
}
.slider_wrap{
  background: #dfdfdf;
  border-radius: 3px;
  position: relative;
  .round_block{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    box-shadow: 0 0 2px #ccc;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%,-50%);
  }
  .current_value{
    height: 100%;
    background-color: $font-main-color;
    background: $main-color;
    overflow: hidden;
  }
}
</style>