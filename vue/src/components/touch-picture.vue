<template lang="pug">
.touch-picture(@touchstart='onTouchStart', @touchmove.prevent.capture='onTouchMove', @touchend='onTouchEnd')
  .wrap(v-el:wrap, :style='wrapStyle')
    img(v-el:img, :src='src', :style='imgStyle', @load='loaded')
</template>
<style lang="less" scoped>
.touch-picture {
  position: relative;
  overflow: hidden;
  .wrap {
    // transform-origin: center center;
    width: auto;
    height: auto;
    display: inline-block;
    > img {
      transition: all .1s ease;
    }
  }
}
</style>
<script>
import services from 'utils/services'
const getComputedStyle = window.getComputedStyle
getComputedStyle
services
export default { // 学生圈帖子图片 传头像操作图片时   触摸图片的操作触摸移动等
  name: 'touch-picture',
  props: {
    src: String,
    outBound: {
      default: () => () => null
    }
  },
  computed: {
    imgStyle () {
      return {
        // width: `${this.width}px`
      }
    },
    wrapStyle () {
      return {
        transform: `translate3d(${this.x}px,${this.y}px,0) scale3d(${this.r},${this.r},1)`,
        transition: this.touching ? '' : 'all .3s ease'
        // , transformOrigin: `${this.touch.x}px ${this.touch.y}px`
      }
    },
    touching () {
      return this.touchLength !== 0
    }
  },
  data () {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      r: 0,
      min: {},
      maxR: 1,
      touchLength: 0,
      center: {x: 0, y: 0}
    }
  },
  methods: {
    moveBack () {
      let rect = this.getRect()
      let outter = this.outBound() || this.$el.getBoundingClientRect()
      let width = outter.right - outter.left
      let height = outter.bottom - outter.top
      let i = 0
      if (rect.right > 0 && rect.left <= 0) {
        i = 1
      }
      if (rect.left > 0 && rect.right <= 0) {
        i = -1
      }
      if (this.nw * this.r > width) i *= -1
      if (i !== 0) {
        // this.x = (this.width - this.nw + i * (this.nw * this.r - this.width)) / 2
        if (i === 1) {
          this.x -= rect.left
        } else {
          this.x += rect.right
        }
      }
      i = 0
      if (rect.bottom > 0 && rect.top <= 0) {
        i = 1
      }
      if (rect.top > 0 && rect.bottom <= 0) {
        i = -1
      }
      if (this.nh * this.r > height) i *= -1
      if (i !== 0) {
        // this.y = (this.height - this.nh + i * (this.nh * this.r - this.height)) / 2
        if (i === 1) {
          this.y -= rect.top
        } else {
          this.y += rect.bottom
        }
      }
    },
    distance (touches) {
      let dx = touches[0].clientX - touches[1].clientX
      let dy = touches[0].clientY - touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    },
    centerPoint (touches) {
      let x = 0
      let y = 0
      for (let i = 0; i < touches.length; i++) {
        x += touches[i].clientX
        y += touches[i].clientY
      }
      return {
        x: x / touches.length,
        y: y / touches.length
      }
    },
    onTouchStart (e) {
      this.touchLength = e.touches.length
      if (e.touches.length === 2) {
        this.dst = this.distance(e.touches)
        this.oldR = this.r
      }
      this.oldX = this.x
      this.oldY = this.y
      this.touch = this.centerPoint(e.touches)
    },
    onTouchMove (e) {
      if (e.touches.length === 2) {
        let dst = this.distance(e.touches)
        this.r = this.oldR * dst / this.dst
      }
      let center = this.centerPoint(e.touches)
      this.x = this.oldX + center.x - this.touch.x
      this.y = this.oldY + center.y - this.touch.y

      let rect = this.getRect()
      if (rect.left < -30) {
        // console.log('toright')
      }
      if (rect.right < -30) {
        // console.log('toleft')
      }
    },
    getRect () {
      let inner = this.$els.wrap.getBoundingClientRect()
      let outter = this.outBound() || this.$el.getBoundingClientRect()
      // console.log(outter, this.outBound())
      return {
        top: inner.top - outter.top,
        left: inner.left - outter.left,
        right: outter.right - inner.right,
        bottom: outter.bottom - inner.bottom
      }
    },
    getClipRect () {
      let inner = this.$els.wrap.getBoundingClientRect()
      let outter = this.outBound() || this.$el.getBoundingClientRect()
      return {
        top: (outter.top - inner.top) / inner.height * this.nh,
        left: (outter.left - inner.left) / inner.width * this.nw,
        width: (outter.width) / inner.height * this.nh,
        height: (outter.height) / inner.width * this.nw
      }
    },
    onTouchEnd (e) {
      this.touchLength = e.touches.length
      this.oldX = this.x
      this.oldY = this.y
      this.touch = this.centerPoint(e.touches)

      // services.utils.toast(`${this.x} ${this.y}`)
      if (e.touches.length === 0) {
        if (this.r < this.min.r) {
          this.r = this.min.r
        }
        if (this.r > this.maxR) {
          this.r = this.maxR
        }
        this.$nextTick(this.moveBack)
      }
    },
    loaded () {
      let img = this.$els.img
      let outter = this.outBound() || this.$el.getBoundingClientRect()
      let width = outter.width // this.$el.clientWidth
      let height = outter.height // this.$el.clientHeight
      let nw = img.naturalWidth
      let nh = img.naturalHeight
      this.width = width
      this.height = height
      this.nw = nw
      this.nh = nh
      this.wrap = this.$els.wrap
      if (nw > nh) {
        this.maxR = height / nh
      } else {
        this.maxR = width / nw
      }
      let xr = width / nw
      let yr = height / nh
      // console.log(xr, yr)
      this.r = xr < yr ? xr : yr
      if (this.r > 1) this.r = 1
      this.x = -(nw - width) / 2
      this.y = -(nh - height) / 2
      this.min = {
        x: this.x,
        y: this.y,
        r: this.r
      }
      if (this.maxR < 1) {
        this.maxR = 1
      }
      this.maxR = 5
      console.log(this.min)
      this.$nextTick(this.moveBack)
      // services.utils.toast(`${this.r} ${width} ${height}`)
    }
  },
  ready () {
    //
    // window.test = this.$els.wrap
  }
}
</script>