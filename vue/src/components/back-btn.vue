<template lang="pug">
.back-btn
  .largetouch(@click='back')
  .icon
  .text 返回
</template>

<script>
export default {
  name: 'back-btn',
  methods: {
    back () {
      if (this.onClick) {   // 如果有重构 则用重构的点击事件
        this.onClick()
      } else {
        window.history.back()  // 否则就 返回上一页
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
.back-btn {
  color: #fff;
  .largetouch {
    position: absolute;
    height: 50px;
    width: 90px;
    margin-left: -20px;
    margin-top: -20px;
  }
  .icon {
    position: absolute;
    display: block;
    top: 2px;
    left: 0;
    width: 12px;
    height: 12px;
    border: 2px solid #fff;
    border-width: 1px 0 0 1px;
    margin-left: 3px;
    margin-top: 1px;
    margin-right: 10px;
    transform: rotate(315deg);
  }
  .text {
    margin-top: 2px;
    margin-left: 15px;
    font-size: 14px;
    line-height: 17px;
  }
}
</style>