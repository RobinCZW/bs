<template lang="pug">
.page-base(:style='pageStyle')
  x-header.page-header(:left-options='leftOptions')
    // 带后退功能的header bar  左边方法是leftOptions(后退)
    slot(slot='left', name='left')
    slot(slot='right', name='right')
    | {{ title }}
  .page-container
    slot
</template>

<script>
import XHeader from 'vux-components/x-header'
export default { // 页面模版(左右各一个控件  中间一个标题  下面整块是内容)  作为子组件被父组件直接使用
  name: 'page-base',
  components: {
    XHeader
  },
  data () {
    return {
      leftOptions: {
        showBack: false // vux控件x-header 是否显示"返回"  默认不显示 要显示"切换学校"等控件
      }
    }
  },
  props: {
    title: {
      default: '' // 标题由父组件传下来
    }
  },
  computed: { // 计算属性 监控父组件的高度
    contentHeight () {
      return this.parentHeight - 46 // 状态栏高度46扣去后是页面模版中 内容 的高度
    },
    pageStyle () { // 用html语法的style属性直接动态指定一下页面 内容 的高度 = 内容高度数值px
      return {
        height: this.contentHeight + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.page-base {
  background-color: #fbf9fe; // 页面模版的背景色
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