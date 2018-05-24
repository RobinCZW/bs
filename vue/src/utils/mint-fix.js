export default function (Vue) {
  // fix tab container
  let TabConatiner = Vue.component('mt-tab-container')
  TabConatiner.options.methods.startDrag = () => {}
  // fix flicker
  let Loadmore = Vue.component('mt-loadmore')
  Loadmore.options.template = `
  <div class="mint-loadmore">
    <div class="mint-loadmore-content" :class="{ 'is-dropped': topDropped || bottomDropped}" :style="loadmoreStyle" v-el:loadmore-content>
      <slot name="top">
        <div class="mint-loadmore-top" v-if="topMethod">
          <spinner v-if="topStatus === 'loading'" class="mint-loadmore-spinner" :size="20" type="fading-circle"></spinner>
          <span class="mint-loadmore-text">{{ topText }}</span>
        </div>
      </slot>
      <slot></slot>
      <slot name="bottom">
        <div class="mint-loadmore-bottom" v-if="bottomMethod">
          <spinner v-if="bottomStatus === 'loading'" class="mint-loadmore-spinner" :size="20" type="fading-circle"></spinner>
          <span class="mint-loadmore-text">{{ bottomText }}</span>
        </div>
      </slot>
    </div>
  </div>`
  Loadmore.options.computed.loadmoreStyle = function () {
    // if (Math.round(this.translate) === 0) return {}
    return {
      transform: `translate3d(0,${this.translate}px,0)`
      // transform: `translate3d(0,0,0)`,
      // marginTop: `${this.translate}px`
    }
  }
  Loadmore.options.methods.handleTouchMove = function (event) {
    if (this.startY < this.$el.getBoundingClientRect().top && this.startY > this.$el.getBoundingClientRect().bottom) {
      return;
    }
    this.currentY = event.touches[0].clientY;
    let distance = this.currentY - this.startY;
    distance /= 3;
    this.direction = distance > 0 ? 'down' : 'up';
    if (typeof this.topMethod === 'function' && this.direction === 'down' && this.getScrollTop(this.scrollEventTarget) === 0 && this.topStatus !== 'loading') {
      event.preventDefault();
      event.stopPropagation();
      this.translate = distance <= this.maxDistance ? distance - this.startScrollTop : this.translate;
      if (this.translate < 0) {
        this.translate = 0;
      }
      this.topStatus = this.translate >= this.topDistance ? 'drop' : 'pull';
    }

    if (this.direction === 'up') {
      this.bottomReached = this.bottomReached || this.checkBottomReached();
    }
    if (typeof this.bottomMethod === 'function' && this.direction === 'up' && this.bottomReached && this.bottomStatus !== 'loading' && !this.bottomAllLoaded) {
      event.preventDefault();
      event.stopPropagation();
      this.translate = Math.abs(distance) <= this.maxDistance ? this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance : this.translate;
      if (this.translate > 0) {
        this.translate = 0;
      }
      this.bottomStatus = -this.translate >= this.bottomDistance ? 'drop' : 'pull';
    }
  }

  let Picker = Vue.component('mt-picker')
  Picker.options.props.visibleItemCount.type = Number
  let PickerSlot = Picker.options.components.PickerSlot
  PickerSlot.options.props.visibleItemCount.type = Number
  let Spinner = Vue.component('mt-spinner')
  Spinner.options.props.size.type = Number
  let Progress = Vue.component('mt-progress')
  Progress.options.props.value.type = Number
}
