<template lang="pug">
.download-detail
  file-detail(
    v-if='curFile',
    :file='curFile',
    :back='true',
    @open='onOpen'
  )
    .delete(slot='right', @click='onDelete') 删除
</template>

<script>
import services from 'utils/services'
export default {
  computed: {
    curFile () {
      let byMd5 = services.download.byMd5
      if (this.md5 && byMd5[this.md5]) { // byMd5是个map key就是文件的md5 value就是文件的 信息对象 信息对象里存各信息
        let item = byMd5[this.md5]
        item = {
          name: item.filename,
          size: item.size,
          path: item.path,
          md5: item.md5
        }
        this.cachedFile = item
        return item
      } else {
        return this.cachedFile
      }
    },
    md5 () {
      return this.$route.params.md5
    }
  },
  methods: {
    onOpen () { // 打开文件(打开操作在子组件file-detail.vue)  后重新记录最后操作时间  以便于列表按最后操作时间排列 这个不是打开文件的函数
      console.log('onOpen', this.md5)
      let byMd5 = services.download.byMd5
      byMd5[this.md5].recordOpTime() // 通过文件的md5值 去修改该文件 信息对象 的lastOptionTime
    },
    onDelete () { // 删除文件
      console.log('ondelete', this.md5)
      return services.download.deleteByMd5(this.md5)
        .then(() => {
          window.history.back()
        })
    }
  },
  data () {
    return {
      cachedFile: null
    }
  }
}
</script>

<style lang="less" scoped>
.download-detail {
  .delete {
    color: #fff;
  }
}
</style>