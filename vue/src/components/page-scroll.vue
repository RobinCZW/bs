<template lang="pug">
div.page-scroll
  page-base(:title='title', v-ref:base)
    slot(slot='left', name='left')
    slot(slot='right', name='right')
    loading(:show='loading', :text='loadingText')
    .header
      slot(name='header', v-ref:header)
    .scroll-box(
      v-el:scroll,
      v-infinite-scroll='bottomMethod()',
      infinite-scroll-distance='50',
      :style='scrollBoxStyle')
      mt-loadmore(:top-method='topMethod', :style='minHeightStyle', :top-status.sync='topStatus', v-ref:loadmore)
        .mint-loadmore-top(slot='top')
          span(v-show="topStatus !== 'loading'", :class="[ 'hold', topStatus ]")
          span(v-show="topStatus === 'loading'")
            mt-spinner.spinner(:size='20', type='fading-circle')
            |  正在加载...
        slot
  .footer
    slot(name='footer')
</template>

<script>
import Loading from 'vux-components/loading'
import PageBase from './page-base'
// import services from 'utils/services'

export default {
  name: 'page-scroll',
  methods: {
    getScrollPosition () {
      return this.$els.scrollTop
    },
    setScrollPosition (val) {
      this.$els.scrollTop = val
    }
  },
  computed: {
    scrollBoxStyle () {
      return {
        height: (this.$refs.base.contentHeight - this.headerHeight) + 'px'
      }
    },
    minHeightStyle () {
      if (this.bottomMethod) {
        return {}
      } else {
        return {
          minHeight: (this.$refs.base.contentHeight - this.headerHeight) + 'px'
          // overflowY: 'visible'
        }
      }
      // return {
      //   overflow: 'visible'
      // }
    },
    contentHeight () {
      return this.parentHeight - this.footerHeight
    }
  },
  components: {
    Loading,
    PageBase
  },
  data () {
    return {
      topStatus: 'pull'
    }
  },
  props: {
    loadingText: {
      default: '加载中'
    },
    loading: {
      default: false
    },
    title: {
      default: ''
    },
    watchData: { // 会监视这个属性来刷新scroller
      required: false,
      default: 0
    },
    topMethod: {
      type: Function,
      default: null
    },
    bottomMethod: {
      type: Function,
      default: null
    },
    footerHeight: {
      default: 0
    },
    headerHeight: {
      default: 0
    }
  },
  watch: {
    watchData () {
      this.$broadcast('onTopLoaded', this.$refs.loadmore.uuid)
      // this.$broadcast('onBottomLoaded', this.$refs.loadmore.uuid)
    }
  }
}
</script>

<style scoped lang="less">
.page-scroll {
  height: 100%;
  bottom: 0;
  position: relative;

  .scroll-box {
    background-color: #fbf9fe;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling : touch;
  }
  .header {
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>

<style lang="less">
.page-scroll {
  .weui_mask_transparent {
    position: absolute !important;
  }
}
.page-scroll {
  .spinner {
    vertical-align: middle;
    display: inline-block;
  }
  .scroll-box {
    > .mint-loadmore {
      overflow: visible;
    }
  }
  .hold {
    &::before {
      content: " ";
      width: 30px;
      height: 30px;
      display: inline-block;
      background-image: url("~assets/refresh.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      transition: transform .3s ease;
      // transform-origin: center center;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  .pull {
    &::after {
      content: "下拉刷新";
    }
  }
  .drop {
    &::before {
      transform: rotate(180deg);
    }
    &::after {
      content: "释放更新";
    }
  }
}
</style>