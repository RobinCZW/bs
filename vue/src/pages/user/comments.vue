<template lang="pug">
.user-comments
  page-base(title='我的评论', :loading='$loadingRouteData', :watch-data='watchData', :top-method='refreshData', :bottom-method='loadmore')
    back-btn(slot='left')
    .wrap
      .navbar
        mt-navbar(:selected.sync='selected')
          mt-tab-item(id='recv') 收到的评论
          mt-tab-item(id='sent') 发出的评论
      .box
        mt-tab-container.tab-container(:active.sync='selected')
          mt-tab-container-item.tab-item(id='recv')
            comment-list.content(prefix='回复', suffix='的主题: ', :store='recvStore', @clickref='onClickRef')
          mt-tab-container-item.tab-item(id='sent')
            comment-list.content(prefix='回复', suffix='的主题: ', :store='sentStore', @clickref='onClickRef')
</template>

<script>
import CommentList from './comment-list'
import services from 'utils/services'

export default { // 发现页 我的评论 分我发出的 和我收到的
  components: {
    CommentList
  },
  created () {
    this.bindSource(this.recvStore, services.xsq.listRecvComment)
    this.bindSource(this.sentStore, services.xsq.listSentComment)
  },
  data () {
    return {
      selected: 'recv',
      recvStore: {
        list: [],
        source: null
      },
      sentStore: {
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
      let creator = item.replyTo.creator
      if (creator.id === services.xsq.uid) {
        creator.nickname = '我'
      }
      return item
    },
    onClickRef (item) {
      services.global.curFeed = item.feed
      this.$router.go({
        name: 'feed.detail'
      })
    }
  },
  computed: {
    contentHeight () {
      return this.parentHeight - 0
    }
  }
}
</script>

<style lang="less" scoped>
.user-comments {
  .wrap {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column; 
    .navbar {
      margin-bottom: 3px;
    }
    .box {
      position: absolute;
      top: 49px;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
  .tab-container {
    height: 100%;
    .tab-item {
      height: 100%;
    }
  }
  .content {
    height: 100%;
  }
}
</style>