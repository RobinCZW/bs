<template lang="pug">
.user-page
  page-scroll(title='用户中心', :loading='initLoading')
    .container
      group.my-group
        vue-ripple
          .user-bar(v-on-hold:bind='tips.modify', v-link='{name: "user.modify"}')
            img(:src='user.avatar')
            .bar-right
              .nickname(v-text='user.nickname')
              .phone(v-text='user.collegeName')
            // .bar-tip(v-show='tips.modify', transition='bar-tip') 修改信息
            .bar-into
            .clearfix
      group.my-group
        vue-ripple(v-link='myorderLink')
          cell(title='打印订单')
            .cell-img.img-myorder(slot='icon')
      group.my-group
        vue-ripple(v-on-hold:bind='tips.dyn', v-link='myfeedLink')
          cell(title='我的动态')
            .cell-img.img-myfeed(slot='icon')
          .group-tip(v-show='tips.dyn', transition='bar-tip') 我发的学生圈
        vue-ripple(v-on-hold:bind='tips.fav', v-link='myfavLink')
          div
          cell(title='我的收藏')
            .cell-img.img-myfav(slot='icon')
          .group-tip(v-show='tips.fav', transition='bar-tip') 这帖子不错
        vue-ripple(v-on-hold:bind='tips.cmt', v-link='mycommentLink')
          div
          cell(title='我的评论')
            .cell-img.img-mycomment(slot='icon')
          .group-tip(v-show='tips.cmt', transition='bar-tip') 有话就说
        vue-ripple(v-on-hold:bind='tips.like', v-link='linkmeLink')
          div
          cell(title='赞我的')
            .cell-img.img-likeme(slot='icon')
          .group-tip(v-show='tips.like', transition='bar-tip') 你说得很好
      group.my-group
        vue-ripple(v-on-hold:bind='tips.feedback', v-link='feedbackLink')
          div
          cell(title='意见反馈')
            .cell-img.img-feedback(slot='icon')
          .group-tip(v-show='tips.feedback', transition='bar-tip') 说出你的想法
        vue-ripple(v-on-hold:bind='tips.joinus', v-link='joinusLink')
          div
          cell(title='加入我们')
            .cell-img.img-joinus(slot='icon')
          .group-tip(v-show='tips.joinus', transition='bar-tip') 志愿者及版主

    // cell(title='abc')
</template>

<script>
import Cell from 'vux-components/cell'
import Group from 'vux-components/group'
import services from 'utils/services'

export default { // 发现页面 也就是用户信息页面
  components: {
    Group,
    Cell
  },
  data () {
    return {
      tips: {
        modify: false,
        dyn: false
      }
    }
  },
  methods: {
    test (a) {
      console.log('aaa', a)
    }
  },
  computed: {
    user () {
      return services.store.user
    },
    myorderLink () {
      return {
        name: 'user.order'
      }
    },
    myfeedLink () { // ????
      return {
        name: 'feed',
        params: {
          tid: 'my',
          name: '我的动态'
        }
      }
    },
    myfavLink () { // ????
      return {
        name: 'feed',
        params: {
          tid: 'myfav',
          name: '我的收藏'
        }
      }
    },
    mycommentLink () {
      return {
        name: 'user.comments'
      }
    },
    linkmeLink () {
      return {
        name: 'user.likeme'
      }
    },
    feedbackLink () {
      return {
        name: 'browser',
        params: {
          protocol: 'http',
          url: 'robinchen.mikecrm.com/Fc00ps'
        },
        query: {
          title: '意见反馈'
        }
      }
    },
    joinusLink () {
      return {
        name: 'browser',
        params: {
          protocol: 'http',
          url: 'robinchen.mikecrm.com/V36ze6'
        },
        query: {
          title: '加入我们'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@avatar-height: 80px;
.user-page {
  .container {
    padding-bottom: 30px;
    .my-group {
      .group-tip {
        position: absolute;
        top: 14px;
        right: 10px;

        font-size: 14px;
      }
    }
  }
  .cell-img {
    height: 24px;
    width: 24px;
    background-size: 100%;
    margin-right: 10px;
  }
  .img-myorder {
    background-image: url("~assets/icon/user/myorder.png");
  }
  .img-myfeed {
    background-image: url("~assets/icon/user/myfeed.png");
  }
  .img-myfav {
    background-image: url("~assets/icon/user/myfav.png");
  }
  .img-mycomment {
    background-image: url("~assets/icon/user/mycomment.png");
  }
  .img-likeme {
    background-image: url("~assets/icon/user/likeme.png");
  }
  .img-feedback {
    background-image: url("~assets/icon/user/feedback.png");
  }
  .img-joinus {
    background-image: url("~assets/icon/user/joinus.png");
  }
  .user-bar {
    /* background-color: #fff; */
    padding: 15px 30px;
    overflow: hidden;
    &>img {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      border-radius: 50%;
      border: 4px solid #cce8fa;
      height: @avatar-height;
      width: @avatar-height;
      float: left;
    }
    .bar-right {
      float: left;
      padding: 10px 20px;
      overflow-x: hidden;
      .nickname {
        font-size: 125%;
        color: rgb(80, 134, 244);
      }
    }
    .bar-into {
      float: right;
      height: @avatar-height;
      width: 27px;
      background-image: url("~assets/icon/into.png");
      background-position: center right;
      background-repeat: no-repeat;
      transform: scale(0.75);
    }
    .bar-tip {
      position: absolute;
      top: calc(50% - 7px);
      right: 10px;

      font-size: 14px;
    }
  }

  .bar-tip-transition {
    transition: all .3s ease;
  }
  .bar-tip-enter {
    transform: translateX(200%);
  }
  .bar-tip-leave {
    transform: translateX(200%);
  }
}
.clearfix {
  clear: both;
}
</style>
