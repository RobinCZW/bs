let installed = false
export default {
  install (Vue, options) {
    if (installed) {
      return
    }
    installed = true

    function onResize () {
      let width = document.documentElement.clientWidth
      let height = document.documentElement.clientHeight
      this.vm.$emit('resize', width, height)
    }
    Vue.directive('on-resize', {
      bind () {
        this._onResize = () => onResize.call(this)
        this._onResize()
        window.addEventListener('resize', this._onResize)
      },
      unbind () {
        window.removeEventListener('resize', this._onResize)
      }
    })
    Vue.mixin({
      computed: {
        parentHeight () {
          if (this._resizeParent) {
            return this._resizeParent.contentHeight
          } else {
            let curVm = this.$parent
            let parent = null
            while (curVm) {
              if ('contentHeight' in curVm) {
                parent = curVm
                break
              }
              curVm = curVm.$parent
            }
            if (parent) {
              this._resizeParent = parent
              return parent.contentHeight
            }
            return null
          }
        }
      }
    })
  }
}
