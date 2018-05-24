<template lang="pug">
.comment-list
  loading(:show='initLoading', text='加载中...')
  .scroll-box(
    v-el:scroll,
    v-infinite-scroll='loadmore()')
    mt-loadmore(:top-method='refreshData', :style='heightStyle', :top-status.sync='topStatus', v-ref:loadmore)
      .mint-loadmore-top(slot='top')
        span(v-show="topStatus !== 'loading'", :class="[ 'hold', topStatus ]")
        span(v-show="topStatus === 'loading'")
          mt-spinner.spinner(:size='20', type='fading-circle')
          |  正在加载...
      comment-item(:prefix='prefix', :suffix='suffix', :comment='item', v-for='item in store.list', @clickref="$emit('clickref', item)")
</template>

<script>
import Loading from 'vux-components/loading'
export default { // ????
  components: {
    Loading
  },
  props: {
    store: {
      required: true
    },
    prefix: {
      required: true
    },
    suffix: {
      required: true
    }
  },
  data () {
    return {
      initLoading: false,
      next: null,
      topStatus: ''
    }
  },
  ready () {
    this.initLoading = true
    this.refreshData()
  },
  methods: {
    loadEnd (r) {
      console.log('loadEnd', r)
      this.next = r.next
      this.initLoading = false
    },
    refreshData () {
      return this.source().then(this.loadEnd, this.loadEnd)
    },
    loadmore () {
      if (this.next) {
        return this.source(this.next).then(this.loadEnd, this.loadEnd)
      }
    }
  },
  computed: {
    heightStyle () {
      return {
        minHeight: this.parentHeight + 'px'
      }
    },
    source () {
      return this.store.source
    }
  },
  watch: {
    'store.list': function () {
      this.$broadcast('onTopLoaded', this.$refs.loadmore.uuid)
    }
  }
}
</script>

<style lang="less" scoped>
.comment-list {
  height: 100%;
  .scroll-box {
    height: 100%;
    background-color: #fbf9fe;
    overflow-y: auto;
    -webkit-overflow-scrolling : touch;
  }
}
</style>
<style lang="less">
.comment-list {
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
