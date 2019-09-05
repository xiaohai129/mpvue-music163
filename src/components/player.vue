<template>
  <div class="player_wrap">
    <div class="player_mask" :style="{backgroundImage:'url(' + (songImg||'') + ')'}">
      <div class="mask_black"></div>
    </div>
    <img src="/static/images/player/needle.png" class="needle">
    <div class="player_content_box">
      <div class="disc_box played" :style="{backgroundImage:'url(' + (songImg||'') + ')'}">
        <img src="/static/images/player/disc.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      songImg: '/static/images/player/109951164217552025.jpg'
    }
  },
  created () {
    console.log(1212)
  }
}
</script>

<style lang="scss" scoped>
@keyframes played{
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
.player_wrap{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  // 音乐播放状态
  &.played{
    .disc_box{
      animation-delay: 1s;
      animation: played 15s linear infinite;
    }
    .needle{
      transform: rotate(8deg);
    }
  }
  .player_mask{
    filter: blur(20PX);
    width: 120%;
    height: 120%;
    position: absolute;
    top: -10%;
    left: -10%;
    z-index: 1;
    background: no-repeat center center;
    background-size: auto 100%;
    .mask_black{
      background-color: rgba($color: #000000, $alpha: 0.5);
      width: 100%;
      height: 100%;
    }
  }
  .player_content_box{
    position: relative;
    z-index: 5;
    .disc_box{
      width: 300px;
      height: 300px;
      margin: 70px auto 0 auto;
      background: no-repeat center center;
      background-size: 194px 194px;
    }
  }
  .needle{
    width: 90px;height: 130px;
    position: absolute;
    left: 50%;
    top: 0;
    z-index: 10;
    transform: rotate(-30deg);
    margin-left: -14px;
    margin-top: -5px;
    transform-origin: 14px 12px; 
    transition: transform 1s ease-in;
  }
}
</style>