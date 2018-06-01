<template lang="pug">
.feed-page
  .fix_pos(v-show='status == "list"', transition='hold')
    .submit-btn(v-if='submitVisible', v-on-hold='onHold', v-link='submitLink')
    // 发布新贴的按钮
    page-scroll(:title='title', :loading='$loadingRouteData', :watch-data='watchData', :top-method='refreshData', :bottom-method='loadmore')
      back-btn(slot='left')
      .feed-container(v-show='!$loadingRouteData')
        feed-item(v-for='item in feedList', :data='item', @detail='detailView(item)', @comment='goComment(item)')
          div(slot='right')
            menu-btn(@click.stop='', :actions='getAction(item)')
            // menu-btn插入feed-item里的右slot里
  .fix_pos(v-show='status == "submit"', transition='rotate', @transitionend='focusText')
    new-feed(v-ref:new-feed, :tid='tid', @send='refreshData')
  .fix_pos(v-if='status == "detail"', transition='right', @transitionend='focusComment')
    feed-detail(v-ref:detail, :feed='detail.feed')
    // 三个fix_pos是三个视图 根据status决定加载哪个   feed-detail是进入详情的页面是浮动出来的  new-feed新帖子编辑的页面  list则是最正常的这个feed流页面
</template>

<script>
import NewFeed from './new-feed'
import FeedDetail from './feed-detail'
import MenuBtn from './menu-btn'
import services from 'utils/services'
const submitNormal = require('assets/icon/xsq/submit2.png')
const submitPress = require('assets/icon/xsq/submit1.png')

export default { // 一个频道里的 整个feed流
  watch: {
    status (val) { // 点击新建新帖子进入编辑页面时  清空本来编辑页的内容
      if (val === 'submit') {
        this.$refs.newFeed.clear()
      }
    }
  },
  components: {
    NewFeed,
    FeedDetail,
    MenuBtn
  },
  data () {
    return {
      next: null,
      source: (tid, next) => { // tid 是一个标记
        if (tid === 'my') { // 我自己发布的帖子  tie从友盟拉取流的时候 已经区别出是否自己发的帖子了
          return services.xsq.listMyFeed(next)
        } else if (tid === 'myfav') { // 我喜欢的帖子(点赞过的)
          return services.xsq.listMyFav(next)
        } else { // 普通帖子
          return services.xsq.listFeed(tid, next)
        }
      },
      detail: {
        feed: {}
      }
    }
  },
  computed: {
    watchData () {
      return [this.feedList, this.status]
    },
    title () {
      return this.$route.params.name // services.xsq.store.topic[this.tid].name   学生圈标题
    },
    tid () {
      return this.$route.params.tid
    },
    feedList () { // feed流里的所有feed
      return services.xsq.store.feedList
    },
    status () {
      if (this.$route.query.status) {
        return this.$route.query.status
      }
      return 'list'
    },
    submitLink () { // 编辑新帖
      return {
        name: 'feed',
        params: this.$route.params,
        query: {
          status: 'submit'
        }
      }
    },
    submitVisible () {
      return !['my', 'myfav'].includes(this.tid)
    }
  },
  methods: {
    getAction (item) { // 点击帖子右上角的操作 可以复制内容  如果是自己的帖子 可以删除
      let actions = [{
        name: '复制内容',
        method: () => {
          console.log('copy: ', item.content)
          if (window.cordova) {
            window.cordova.plugins.clipboard.copy(
              item.content,
              () => services.utils.toast('复制成功'),
              () => services.utils.toast('复制失败')
            )
          }
        }
      }]
      if (item.creator.id === services.xsq.uid) { // 帖子item 的作者creator id 和 自己的 uid 一致
        actions.push({ // action添加一个删除的操作
          name: '删除',
          method: () => {
            console.log('delete: ', item.id)
            services.xsq.deleteFeed(item.id) // 学生圈删除帖子的操作
              .then(
                () => services.utils.toast('删除成功'),
                () => services.utils.toast('删除失败')
              )
          }
        })
      }
      return actions
    },
    refreshData () {
      return this.source(this.tid)
        .then(r => {
          this.next = r.next
        })
    },
    loadmore () {
      console.log('feed loadmore')
      if (this.next) {
        let bNext = this.next
        let ret = this.source(this.tid, this.next)
          .then(r => {
            this.next = r.next
          })
          .catch(r => {
            this.next = bNext
          })
        this.next = null
        return ret
      }
    },
    onHold (e, start) { // 发布新帖的按钮 hold住的时候  颜色(图片)变化
      e.currentTarget.style.backgroundImage = `url(${(start ? submitPress : submitNormal)})`
    },
    goComment (item) { // 点击评论  会进入帖子详情  并弹出评论小框供输入评论内容
      services.global.curFeed = item
      this.$router.go({
        name: 'feed',
        params: this.$route.params,
        query: {
          status: 'detail',
          cmt: '1'
        }
      })
    },
    focusComment () { // 进入详情页时默认触发focus评论框,弹出键盘
      if (this.$route.query.cmt) {
        this.$refs.detail.focusComment()
      }
    },
    detailView (item) { // 点击帖子  会进入帖子详情
      services.global.curFeed = item
      // this.detail.feed = item
      this.$router.go({
        name: 'feed',
        params: this.$route.params,
        query: {
          status: 'detail'
        }
      })
      // services.global.curFeed = item
      // this.$router.go({
      //   name: 'feed.detail'
      // })
    },
    focusText (e) { // 进入编辑新贴子的页面时自动focus文本框
      if (this.status === 'submit') {
        this.$refs.newFeed.focusText()
      }
    }
  },
  route: {
    data ({ from, to: {params: {tid}} }) {
      if (from.name === 'feed') {
        if (from.params.tid === tid) {
          return {}
        }
      } else if (from.name === 'feed.detail') {
        return {}
      }
      console.log(from.name)
      return this.refreshData()
        .then(() => true)
    }
  }
}
</script>

<style lang="less" scoped>
.feed-page {
  position: relative;
  height: 100%;
  width: 100%;
  bottom: 0;
  overflow: hidden;
  .fix_pos {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .submit-btn { // 发起新贴的按钮
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 60px;
    height: 60px;
    background-image: url("~assets/icon/xsq/submit1.png");
    background-size: 60px;
    background-repeat: no-repeat;
    z-index: 999; // 叠加在所有视图上面
  }
  .feed-container {
    padding-bottom: 30px;
  }
}

.hold-transition {
  transition: all .3s ease;
}
.hold-enter {
  opacity: 1;
}
.hold-leave {
  transition-delay: .3s;
  opacity: 0;
}

.rotate-transition {
  transition: all .3s ease;
  transform-origin: right bottom;
}
.rotate-enter {
  transform: rotate(90deg);
  opacity: 0;
}
.rotate-leave {
  transition-timing-function: ease-in;
  transform: rotate(-90deg);
  opacity: 0;
}

.right-transition {
  transition: all .3s ease;
}
.right-enter, .right-leave {
  position: absolute;
  top: 0;
  transform: translateX(100%);
}
</style>