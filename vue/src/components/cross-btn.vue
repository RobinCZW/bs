<template lang="pug">
.cross-btn(@click='back')
</template>

<script>
export default { // 文件详情页 的关闭按钮  其实和返回按钮是一样的  只不过前端显示是个关闭按钮
  name: 'cross-btn',
  methods: {
    back () {
      if (this.onClick) {
        this.onClick()
      } else {
        window.history.back()
      }
    }
  },
  props: {
    onClick: {
      default: null
    }
  }
}
</script>

<style lang="less" scoped>
.cross-btn {
  color: #fff;
  height: 40px;
  width: 40px;
  background-image: url("~assets/icon/header/close.png");
  background-size: 40px;
  margin-left: -10px;
  margin-top: -10px;
}
</style>