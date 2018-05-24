<template lang="pug">
.page-base(:style='pageStyle')
  x-header.page-header(:left-options='leftOptions')
    slot(slot='left', name='left')
    slot(slot='right', name='right')
    | {{ title }}
  .page-container
    slot
</template>

<script>
import XHeader from 'vux-components/x-header' // ???? 左边一个返回 中间一个标题 的页面模版
export default {
  name: 'page-base',
  components: {
    XHeader
  },
  data () {
    return {
      leftOptions: {
        showBack: false
      }
    }
  },
  props: {
    title: {
      default: ''
    }
  },
  computed: {
    contentHeight () {
      return this.parentHeight - 46
    },
    pageStyle () {
      return {
        height: this.contentHeight + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-base {
  background-color: #fbf9fe;
  height: 100%;
  padding-top: 46px;
  .page-header {
    margin-top: -46px;
  }
  .page-container {
    height: 100%;
    overflow: hidden;
    position: relative;
  }
}
</style>