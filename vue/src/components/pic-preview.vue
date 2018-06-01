<template lang="pug">
.pic-preview
  .img(:style='imgStyle')
</template>

<script>
export default { // 学生圈帖子 小图预览
  name: 'pic-preview',
  props: {
    src: {
      required: true
    }
  },
  computed: {
    imgStyle () {
      // naturalWidth
      return {
        'background-image': `url("${this.src}")`
      }
    }
  },
  watch: {
    src () {
      // hehe...
    }
  }
}
</script>

<style lang="less" scoped>
.pic-preview {
  display: inline-block;

  .img {
    padding-top: 100%;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>
