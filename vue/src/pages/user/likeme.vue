<template lang="pug">
.user-comments
  page-base(title='赞我的', :loading='$loadingRouteData')
    back-btn(slot='left')
    comment-list(:store='store', prefix='@', suffix=': ', @clickref='onClickRef')
</template>

<script>
import CommentList from './comment-list'
import services from 'utils/services'

export default { // 发现页 赞我的
  components: {
    CommentList
  },
  created () {
    this.bindSource(this.store, services.xsq.listLikeme)
  },
  data () {
    return {
      store: {
        list: [],
        source: null
      }
    }
  },
  methods: {
    bindSource (store, source) {
      store.source = (next) => {
        return source(store, next, this.mapper)
      }
    },
    mapper (item) {
      item.content = '赞了这条动态'
      return item
    },
    onClickRef (item) {
      services.global.curFeed = item.feed
      this.$router.go({
        name: 'feed.detail'
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>