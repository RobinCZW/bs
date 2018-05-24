<template lang="pug">
.loadmore-btn(@click='onClick')
  slot
    | 点击加载更多
</template>

<script>
export default { // 点击加载更多 学生圈频道列表底部   但实际无显示  自动触发了
  name: 'loadmore-btn',
  methods: {
    onClick () {
      this.$emit('loadmore')
    }
  }
}
</script>

<style lang="less" scoped>
.loadmore-btn {
  position: relative;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  text-align: center;
  &:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
}
</style>
