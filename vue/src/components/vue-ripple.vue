<template lang="pug">
div
  .fallback-ripple(v-if='disabled', v-on-hold:bind='hold')
    slot
    .cover(:class="coverStyle")
  vue-haru-ripple(v-else,color='#000',opacity='0.15')
    slot
</template>
<script>
import VueHaruRipple from 'vue-haru-ripple' // ripple 这是一个点击后有 波纹效果 的效果而已
import services from 'utils/services'
export default {
  name: 'vue-ripple',
  components: {
    VueHaruRipple
  },
  data () {
    return {
      disabled: services.config.disableRipple,
      hold: false
    }
  },
  computed: {
    coverStyle () {
      return {
        'cover-hold': this.hold
      }
    }
  }
}
</script>
<style lang="less">
.fallback-ripple {
  position: relative;
  overflow: hidden;

  .cover {
    pointer-events: none;

    position: absolute;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: #000;
    opacity: 0;
    transition: all .3s ease;
  }
  .cover-hold {
    opacity: 0.15;
  }
}
</style>