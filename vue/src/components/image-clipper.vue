<template lang="pug">
div
  .image-clipper(v-transfer-dom)
    mt-popup.popup(:visible.sync='visible', position='bottom')
      .wrap
        .container
          touch-picture.preview(:src='deferSrc', :out-bound='outBound', v-ref:pic)
          .mask
            .circle(v-el:circle)
          .bar
            mt-button(@click='clip') 确定
</template>

<script>
import TouchPicture from 'components/touch-picture'
import { clipImage } from 'utils/canvas'
export default { // 注册传头像 以及修改头像时 裁剪图片的  clipper裁剪
  name: 'image-clipper',
  components: {
    TouchPicture
  },
  props: {
    visible: {
      twoWay: true,
      required: true
    },
    src: {
      required: true
    }
  },
  data () {
    return {
      //
    }
  },
  methods: {
    outBound () {
      return this.$els.circle.getBoundingClientRect()
    },
    clip () {
      let pic = this.$refs.pic
      let rect = pic.getClipRect()
      clipImage(this.src, rect.left, rect.top, rect.width, rect.height, 640, 640, 0.5, (r) => {
        // this.visible = false
        this.$emit('clip', r)
        window.history.back()
      })
    }
  },
  computed: {
    deferSrc () {
      if (this.visible) {
        return this.src
      } else {
        return ''
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        let query = this.$route.query
        query.imageclipper = 1
        this.$router.go({
          query: query
        })
      }
    },
    '$route.query.imageclipper': function (val) {
      if (!val) {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.image-clipper {
  background-color: rgba(0,0,0,0);
  .popup {
    width: 100%;
    height: 100%;
  }
  .wrap {
    width: 100%;
    height: 100%;
    // padding: 20px 0;
    .container {
      background-color: rgb(128,128,128);
      position: relative;
      width: 100%;
      height: 100%;
      .preview {
        height: 100%;
        width: 100%;
      }
      .mask {
        pointer-events: none;
        position: absolute;
        // width: 100%;
        // height: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .circle {
          width: 80vw;
          height: 80vw;
          margin: 0 10%;
          top: 100px;
          // background-color: white;
          box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
          border-radius: 100%;
          // background: radial-gradient(transparent 40vw, rgba(0,0,0,.5) 40vw);
        }
      }
      .bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        > button {
          width: 100%;
        }
        background-color: rgba(255, 255, 255, 1);
      }
    }
  }
}
</style>