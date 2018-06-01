<template lang="pug">
.feed-detail
  page-scroll(title='动态详情', :loading='loading', :top-method='refreshData', :bottom-method='loadmore', :watch-data='comments', :footer-height='footerHeight')
    back-btn(slot='left')
    .container
      .input-mask(v-show='inputing', @click='closeInput')
      // 详情页里 上半部就是一个 feed-item 只是操作bar变成了只有赞和收藏
      feed-item(:data='feed', :bar='false')
      .no-comment(v-if='!loading && comments.length === 0')
        img(src='~assets/icon/xsq/no_comment.png')
      comment-item(v-for='item in comments', :comment='item')
        div(slot='right')
          // .reply(@click='onReplyTo(item)')
          comment-btn(@click='onReplyTo(item)')
          menu-btn(:actions='getAction(item)')
    .fix-input(slot='footer', v-el:fix-input)
      .tool-bar(v-show='inputing')
        check-box.left(:value.sync='anonymous') 匿名
        mt-button.send.right(@click='sendComment') 发送
        .remain.right {{ 140 - comment.length }}
      .wrap(@click='openInput')
        flex-textarea(v-ref:text, :value.sync='comment', :height.sync='inputHeight', :placeholder='placeholder', maxlength='140')
</template>

<script>
// const iconCellOp = require('assets/icon/xsq/cell_operate.png')
import MenuBtn from './menu-btn'
import CommentBtn from './comment-btn'
import Group from 'vux-components/group'
import services from 'utils/services'
export default { // feed详情页
  components: {
    Group, // 常见的表单组件都必须作为Group的子组件。 属于Group子组件的有：Cell, XInput, XTextarea, XSwitch, Calendar, XNumber, Radio, XAddress, Datetime, Selector
    MenuBtn,
    CommentBtn
  },
  props: {
    // feed: {
    //   required: true
    // }
  },
  data () {
    return {
      next: null,
      loading: false, // 上面template里的代码 有:loading='loading' 就是 v-bind:loading = 'loading'绑定这里的loading变量
      inputHeight: 0,
      inputing: false, // 正在输入评论
      comment: '',
      anonymous: true, // 匿名  默认开启
      replyTo: null
    }
  },
  computed: {
    feed () { // 当前 feed          返回当前feed对象 里面存储着当前feed所有东西
      return services.global.curFeed
    },
    feedId () {
      return this.feed.id
    },
    comments () { // 返回当前feed的评论列表
      // if (this.loading) return []
      return services.xsq.store.commentList
    },
    footerHeight () {
      return this.inputHeight + (this.inputing ? 35 : 0)
    },
    placeholder () { // hint的提示字符串 分回复别人 和 单纯自己发评论
      if (this.replyTo) {
        return `回复 ${this.replyTo.creator.nickname}`
      }
      return '点此输入你的评论'
    }
  },
  methods: {
    getAction (item) { // 对帖子的操作  有复制和删除
      let actions = [{
        name: '复制内容',
        method: () => {
          console.log('copy: ', item.content)
          if (window.cordova) {
            window.cordova.plugins.clipboard.copy( // 调用到原生控件   把内容复制到剪贴板
              item.content,
              () => services.utils.toast('复制成功'),
              () => services.utils.toast('复制失败')
            )
          }
        }
      }]
      if (item.creator.id === services.xsq.uid) {
        actions.push({
          name: '删除',
          method: () => {
            console.log('delete: ', item.id)
            services.xsq.deleteComment(this.feedId, item.id)
              .then(
                () => services.utils.toast('删除成功'),
                () => services.utils.toast('删除失败')
              )
          }
        })
      }
      return actions
    },
    focusComment () { // 点击评论区  聚焦并弹出键盘
      this.$refs.text.focus()
      this.openInput()
    },
    onReplyTo (item) { // 回复 别人的 评论
      console.log('reply to', item.creator)
      this.replyTo = item
      this.focusComment()
    },
    openInput () { // 打开键盘
      // this.inputing = true
      let query = this.$route.query
      query.inputing = 1
      this.$router.go({
        query
      })
    },
    closeInput () { // 关闭键盘
      // this.inputing = false
      console.log('close')
      this.replyTo = null
      window.history.back()
      document.activeElement.blur()
    },
    loadmore () { // 加载更多  绑定到scroll-page框架了  下拉到底自动执行
      if (this.next) {
        return services.xsq.listComment(this.feedId, this.next)
          .then(this.loadEnd, this.loadEnd)
      }
    },
    loadEnd (r) {
      this.inputHeight++ // reset the height
      this.inputHeight--
      this.next = r.next
      this.loading = false
    },
    refreshData () { // 上面的template 有 :top-method='refreshData' 是top-method 绑定这里的 refreshData 函数 top-method是list框架自带的函数
      return services.xsq.listComment(this.feedId)
        .then(this.loadEnd, this.loadEnd)
    },
    sendComment () { // 发送评论   如果为空,会提示   然后调xsq的接口发送评论内容
      if (this.comment.length === 0) {
        services.utils.toast('请输入评论再发送')
        return
      }
      this.loading = true
      return services.xsq.sendComment(this.comment, this.feed, this.anonymous, this.replyTo)
        .then(() => {
          this.comment = ''
        })
        .then(this.closeInput)
        .then(this.refreshData)
        .catch(this.loadEnd)
    }
  },
  watch: {
    feedId (feedId) {
      services.xsq.store.commentList = []
      this.loading = true
      this.refreshData()
    },
    '$route.query.inputing': function (val) {
      // if (!val) {
      //   this.inputing = false
      // }
      this.inputing = !!val
    }
  },
  ready () {
    this.loading = true
    services.xsq.store.commentList = []
    this.refreshData()
  }
}
</script>

<style lang="less" scoped>
.fix-input {
  // position: fixed;
  // bottom: 0;
  // left: 0;
  width: 100%;
  background-color: #f0f0f0;
  box-sizing: border-box;
  padding: 5px;
  .tool-bar {
    height: 35px;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
    .send {
      height: 28px;
    }
    .remain {
      color: #aaa;
      margin-right: 5px;
    }
  }
  .wrap {
    border: 5px solid #fff;
    border-radius: 5px;
  }
}
.feed-detail {
  height: 100%;
  position: relative;
  .container {
    padding-bottom: 15px;
    position: relative;
    .input-mask {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 100;
    }
    .no-comment {
      background-color: #fff;
      padding: 5px;
      &::after {
        display: block;
        content: "还没有评论, 你来评一个";
        text-align: center;
      }
      &>img {
        display: block;
        margin: 0 auto;
      }
    }
    .comment-right {
      &>div {
        width: 20px;
        height: 20px;
        background-size: 20px;
      }
      .reply {
        background-image: url("~assets/icon/xsq/comment.png");
      }
      .more {
        background-image: url("~assets/icon/xsq/cell_operate.png");
      }
    }
  }
}
</style>