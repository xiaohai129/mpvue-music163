<template>
  <div class="wrap xh_slider" 
    @touchmove='setCurrentValue'
    @touchend='onTouchend'
    :style="{marginTop:height+'rpx'}"
  >
    <div class="slider_wrap" :style="{height:height+'rpx'}">
      <div class="round_block" :style="{left:cvalue+'%'}"></div>
      <div class="current_value" :style="{width:cvalue+'%'}"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 0,
      isControl: false,
      controlValue: 0
    }
  },

  props: {
    height: {
      type: Number,
      default: 6
    },
    countValue: {
      type: Number,
      default: 1
    },
    currentValue: {
      type: Number,
      default: 0
    }
  },

  created () {
    this.getWrapHeight()
  },

  methods: {
    setCurrentValue (e, value) {
      this.isControl = true
      if (value) {
        this.currentValue = value
        this.controlValue = value
      } else {
        let currentValue = this.countValue / this.width * (e.clientX - e.currentTarget.offsetLeft)
        if (currentValue > this.countValue || currentValue < 0) {
          return false
        }
        this.currentValue = currentValue
        this.controlValue = currentValue
        this.$emit('change', currentValue)
      }
    },
    getWrapHeight () {
      let query = wx.createSelectorQuery()
      query.select('.slider_wrap').boundingClientRect()
      query.exec((res) => {
        this.width = res[0].width
      })
    },
    onTouchend () {
      this.isControl = false
      if (Math.abs(this.controlValue - this.currentValue) > 5) {
        this.$emit('changeEnd', this.controlValue)
      }
    }
  },

  computed: {
    cvalue () {
      if (this.countValue <= 0) {
        return 0
      }
      let currentValue = this.currentValue
      if (this.isControl) {
        currentValue = this.controlValue
      }
      return (currentValue / this.countValue * 100).toFixed(2)
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
    border-radius: 3px;
  }
}
</style>