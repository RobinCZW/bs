<template lang="pug">
.right-upload(@click='onClick') 上传资料
</template>

<script>
export default { // 这边就是普通的一个调用本地浏览器打开网页的操作
  methods: {
    onClick () {
      window.open('https://finalexam.cn/', '_system')
      // this.$router.go({
      //   name: 'file-upload'
      // })
    }
  }
}
</script>

<style scoped lang="less">
.right-upload {
  background-image: url("~assets/icon/header/upload.png");
  background-size: 30px;
  background-repeat: no-repeat;
  padding-left: 30px;
  color: #fff;
  font-size: 15px;
  line-height: 30px;
}
</style>
