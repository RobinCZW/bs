<template lang="pug">
.download-page
  page-scroll(title='已下载')
    .no-file(v-if='list.length === 0')
      img(src='~assets/icon/nofiles.png')
    div(v-for="item in list | orderBy 'lastOp' -1", @click='enter(item)')
      vue-ripple
        icon-item(v-if='taskDone(item)', :lb='item.path | course', :rb='item.lastOp | friendlyTime', :icon='item.name | typeUrl', :name='item.name')
        icon-item(v-if='!taskDone(item)', :icon='item.name | typeUrl', :name='item.name')
          mt-progress.progress(:value='progress(item)')
</template>

<script>
import services from 'utils/services' // 已下载 页面
import { getTypeUrl, displaySize } from 'utils/file'
services

export default {
  filters: {
    typeUrl (val) {
      return getTypeUrl(val)
    },
    displaySize,
    course (val) {
      try {
        return /\/([^\/]+)/.exec(val)[1]
      } catch (e) {
        return ''
      }
    }
  },
  computed: {
    list () { // 已下载的文件列表
      let list = services.download.items.map(i => ({
        name: i.filename,
        size: i.size,
        path: i.path,
        md5: i.md5,
        lastOp: new Date(i.lastOp),
        task: i
      }))
      return list
    }
  },
  data () {
    return {
      curFile: {}
    }
  },
  methods: {
    progress (item) { // 文件下载的进度
      const task = item.task
      if (task) {
        let progress = task.progress
        if (progress.total !== 0) {
          return progress.loaded / progress.total * 100
        }
      }
      return 0
    },
    taskDone (item) { // 文件下载完成
      const task = item.task
      return task && (task.nativeURL !== '')
    },
    enter (item) { // 点击文件  进入详情页
      this.$router.go({
        name: 'download.detail',
        params: {
          md5: item.md5
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.download-page {
  .no-file {
    box-sizing: border-box;
    padding: 20% 10%;
    // width: 100%;
    &>img {
      transform: scale(0.6);
      display: block;
      margin: 0 auto;
      filter: contrast(94%) sepia(5%) hue-rotate(235deg);
    }
  }
  .progress {
    width: 100%
  }
}
</style>