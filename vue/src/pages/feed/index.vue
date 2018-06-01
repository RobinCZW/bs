<template lang="pug">
.feed-index
  router-view(keep-alive)
  // router-view 该嵌套路由被feed.vue替换 keep-alive 可以使被包含的组件状态维持不变，即便是组件切换了，其内的状态依旧维持在内存之中。在下一次显示时，也不会重现渲染。
</template>

<style lang="less" scoped>
.feed-index {
  
}
</style>