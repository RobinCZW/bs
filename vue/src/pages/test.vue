<template lang="pug">
.test-page
  page-base(title='test', v-ref:base)
    touch-picture.full(:src='src')
</template>
<script>
export default {
  data () {
    return {
      n: 50,
      src: require('assets/splash.png')
    }
  }
}
</script>
<style lang="less" scoped>
.test-page {
  background-color: #fbf9fe;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  .full {
    height: 100%;
    width: 100%;
  }
}
</style>
// :height=''