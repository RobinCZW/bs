<template lang="pug">
div.page-listview
  page-base(:title='title', v-ref:base)
    slot(slot='left', name='left')
    slot(slot='right', name='right')
    loading(:show='loading', :text='loadingText')
    .scroll-box(:style='heightStyle')
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
import ListView from 'libs/list-view'
// import services from 'utils/services'

export default { // 课程列表用的 长列表 下端自动加载更多 顶端带刷新
  name: 'page-listview',
  computed: {
    heightStyle () {
      return {
        height: this.$refs.base.contentHeight + 'px'
      }
    },
    minHeightStyle () {
      if (this.bottomMethod) {
        return {}
      } else {
        return {
          minHeight: this.$refs.base.contentHeight + 'px'
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
    PageBase,
    ListView
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
.page-listview {
  height: 100%;
  bottom: 0;
  position: relative;

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
  .spinner {
    vertical-align: middle;
    display: inline-block;
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