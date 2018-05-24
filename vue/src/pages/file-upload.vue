<template lang="pug">
.file-upload
  page-base(title='上传资料')
    back-btn(slot='left')
    group(title='常用的文件夹')
      file-item(:is-folder='true', name='从QQ接收到的文件')
</template>

<style lang="less" scoped>
.file-upload {

}
</style>

<script>
import Group from 'vux-components/group'
export default { // 文件上传  废弃
  components: {
    Group
  }
}
</script>