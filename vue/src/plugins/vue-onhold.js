import Vue from 'vue'

let installed = false
const SUPPORT_TOUCH = 'ontouchstart' in window
const vueUtil = Vue.util
const TABLE = {
  'touchstart': 'start',
  'touchend': 'end',
  'touchcancel': 'end',
  'mousedown': 'start',
  'mouseup': 'end'
}
export default {
  install (Vue, options) {
    if (installed) {
      return
    }
    installed = true

    Vue.directive('on-hold', {
      acceptStatement: true,
      twoWay: true,
      listener (e) {
        let type = TABLE[e.type]
        // console.log(e.currentTarget, this.el, e.currentTarget === this.el)
        if (this.handler[type]) {
          this.handler[type].call(this.vm, e)
        }
        if (this.handler['all']) {
          this.handler['all'].call(this.vm, e, type === 'start')
        }
        if (this.value) {
          this.set(type === 'start')
        }
      },
      bind () {
        this.handler = {}
        this.listener = vueUtil.bind(this.listener, this)
        if (SUPPORT_TOUCH) {
          vueUtil.on(this.el, 'touchstart', this.listener, false)
          vueUtil.on(this.el, 'touchend', this.listener, false)
          vueUtil.on(this.el, 'touchcancel', this.listener, false)
        } else {
          vueUtil.on(this.el, 'mousedown', this.listener, false)
          vueUtil.on(this.el, 'mouseup', this.listener, false)
        }
      },
      update (fn) {
        this.arg = this.arg || 'all'
        if (this.arg === 'bind') {
          this.value = true
          return
        }
        if (typeof fn !== 'function') {
          this.handler[this.arg] = null
          console.warn(
            '[vue-onhold] invalid handler function for v-touch: ' +
            this.arg + '="' + this.descriptor.raw
          )
        } else {
          this.handler[this.arg] = fn
        }
      },
      unbind () {
        if (SUPPORT_TOUCH) {
          vueUtil.off(this.el, 'touchstart', this.listener, false)
          vueUtil.off(this.el, 'touchend', this.listener, false)
          vueUtil.off(this.el, 'touchcancel', this.listener, false)
        } else {
          vueUtil.off(this.el, 'mousedown', this.listener, false)
          vueUtil.off(this.el, 'mouseup', this.listener, false)
        }
      }
    })
  }
}
