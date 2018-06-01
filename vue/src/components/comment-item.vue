<template lang="pug">
.comment-item
  sender-bar(
    :time='comment.create_time | friendlyTime',
    :creator='comment.creator'
  )
    slot(slot='right', name='right')
  .content
    .text(v-text='comment.content')
    // 回复者的文字内容
    .referrer(v-if='comment.replyTo', @click='onClickRef')
      // 发帖者块
      .refcontent(v-text='replyContent')
      // 发帖者的文字内容
</template>

<script>
/*eslint eqeqeq: "off"*/
import SenderBar from 'components/sender-bar'
export default { // 评论区里  每个评论的item  每条评论就是一个item   有单独的评论  也有回复别人的回复,此时加载的样式较复杂
  name: 'comment-item',
  components: {
    SenderBar
  },
  props: {
    comment: {
      required: true
    },
    prefix: {
      default: '回复@' // prefix和suffix中间放发帖者的昵称
    },
    suffix: {
      default: '的评论: '
    }
  },
  computed: {
    replyContent () {
      let comment = this.comment.replyTo
      if (comment.content === '') {
        return '该评论已删除'
      } else {
        return `${this.prefix}${comment.creator.nickname}${this.suffix}${comment.content}`
      }
    }
  },
  methods: {
    onClickRef () {
      this.$emit('clickref')
    }
  }
}
</script>


<style lang="less" scoped>
.comment-item {
  position: relative;
  background-color: #fff;
  &:after {
    content: " ";
    position: absolute;
    display: block;
    left: 10px;
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: #eee;
  }
  // margin-top: 15px;
  .content {
    padding: 0 10px;
    padding-left: 60px;
    padding-bottom: 10px;
    .text {
      margin-bottom: 5px;
    }
    .referrer {
      background-color: rgb(220, 244, 248);
      border-radius: 5px;
      padding: 5px;
      .refcontent {
        display: inline;
      }
    }
  }
}
</style>