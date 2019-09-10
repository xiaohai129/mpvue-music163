<script>
export default {
  created () {
    this.$store.dispatch('getSystemInfo')
    this.$store.dispatch('getAudioManager')
  }
}
</script>
<style lang='scss'>

  @font-face {font-family: "iconfont";
    src: url('//at.alicdn.com/t/font_1393436_angfykfhqrr.eot?t=1567758398712'); /* IE9 */
    src: url('//at.alicdn.com/t/font_1393436_angfykfhqrr.eot?t=1567758398712#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAASEAAsAAAAACcwAAAQ3AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDTgqGGIUIATYCJAMcCxAABCAFhG0HcxtjCMgekiSEQAEFEihAgcYcD1/7vZ67uw9C6BKF6Hl8FFhWqOIjoSTrDBhRVQusKtQf/jfXW1SomBk4AXHB0sh5EZ1f599Fl578/xwzXj2fDfPbbCQzrW4aRdLecJw8oO4La5I7OmswOgXxbHap8njrMoFuk4KQDnKKqgBTQWcF4hrHYMBMlEoLNrSSumZjEe8ATZueyDcA8Na8f/wDEcEkqTJ61eFVdgdI+0n+fJzi/O/UlKeCSfvTY7iNjCVAIR5qjfcoLriEonvupzoAFue0kvST8kn5af7n4///85NMkMe4V2Ts1suC1Kr5P16SiRoV9gJzEqr5SRbMIKJAroJICbmAaD4oFH4dk0sQHYfIs0c14v4jhP8T0yPVFpoYipDYgP5RjYunlM8fFJMnG3jU3r7thJK+8qivbfuonurcMk1ew562jUR63M7hHC+evrV6q/NM1IJcNrq4wC0fXbaI0ZA1XXaw9qzzQdVwku9mxfHHo48SFvlsAs3D2odxixcrNvvenmSUbPJZtEg+yXuojw5cfOhOXfMg69IjD9r6x0TyGrXsTdvUtOXbfTkbt6qoS7Y0Ytsv+i8F1PcnvKb5oJtWaRYP1Iq91oqt69hyKWAZyT3Yad/p3sjGlcoFsXf3FIW5HW56+fYdfxb5964bF+cngbfjaLwh1ZRVKwe1nHdI8Ab9401Ruq+9lpo35BLO4A1x2R9+/t4Ibfz98ySbN8hjrGv7PAbnlfWna2Bay0ES5c5J8T5Fdb5F/pN2KiVcEZd+Oh42k5rU+Kz3kC4QppcGidVhj8IbuMvSnfO4fhm3MVGqxGvJdQEHpzfnwQAg/My3FBQoxAopsdjGLqR8Grjp6mMeY5Qzxszm75/j3BjqnKK8pwjl97yRazapgqefzwWRw2/WedZhAB15MWUqAORX5PsAEF/JawHozL0UPuR35HcwvyW/+YN9jumPxfdbBUlfmZwCviyJT4Gzo4D9OVtJX8XfibVmRVlwqKops/wiS6BxF8VJ6GZ1/JGsw17tTzy2djqhNRYgaUxA1ppCFMwSVHpsQa21Dd0W5W7vMcKKIkoXFkwkEAbthqTfJ8gG3UQUzEuojPsCtcGgQLejkBzYYyZwdqYVge1IB9TeB+E6woRyjZ1tMysQzGGArTHH4GsQqw33QOEhYXkkFzEh1n0ssXVjEXY7CqFWwgjlkOsQg4GAzFaiC9HZQzrtdnNCaCha90whOsII2PZZIWB2iA6Qdn0gOB2CCaqa27FLb18BgXEwgFlbcs6payCsbPD+IeFChK2ByBWa1sp5LsNtumEi2NmhvWkoK4IRJAd6hIEFCRBz/bguCB27EJ1b+M0ShBa10HWFIccXG1/nFuhG79dEihwlqqijiVZ9RqCwCeP24SYDbnuCMZjgRTyH0jP64cfmN2EcW2cu68N1CuFg9eKwUwAAAA==') format('woff2'),
    url('//at.alicdn.com/t/font_1393436_angfykfhqrr.woff?t=1567758398712') format('woff'),
    url('//at.alicdn.com/t/font_1393436_angfykfhqrr.ttf?t=1567758398712') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
    url('//at.alicdn.com/t/font_1393436_angfykfhqrr.svg?t=1567758398712#iconfont') format('svg'); /* iOS 4.1- */
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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


  img{width: 100%;height: 100%;}
</style>
