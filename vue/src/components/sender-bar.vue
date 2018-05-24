<template lang="pug">
  .sender
    img.avatar(:src='avatar', @error='onError')
    .info
      .author
        .nickname(v-text='nickname')
        img.gender(v-if='genderIcon.length > 0', :src='genderIcon')
      .from
        .time(v-text='time')
        // .school 来自[{{ school }}]
    .right
      slot(name='right')
    .clear
</template>

<script>
/*eslint eqeqeq: "off"*/
const boy = require('assets/icon/boy.png')
const girl = require('assets/icon/girl.png')
export default { // 学生圈帖子以及评论里  发送者的信息 包括发送者头像 匿名否 昵称 性别图标 来自的学校(已经隐藏)
  name: 'sender-bar',
  props: {
    time: {
      required: true
    },
    creator: {
      required: true
    }
  },
  methods: {
    onError () {
      this.avatar = require('assets/logo.png')
    }
  },
  computed: {
    anonymous () {
      return this.creator.anonymous
    },
    avatar () {
      return this.creator.avatar
    },
    nickname () {
      return this.creator.nickname
    },
    genderIcon () {
      return this.creator.gender == 1 ? boy : girl
    },
    school () {
      return this.creator.school
    }
  }
}
</script>

<style lang="less" scoped>
.sender {
  box-sizing: border-box;
  height: 60px;
  padding: 9px;
  .avatar {
    width: 42px;
    height: 42px;
    margin-right: 10px;
    border-radius: 50%;
    float: left;
  }
  .info {
    float: left;
    display: inline-block;
    padding-top: 2px;
    .author {
      line-height: 1;
      .nickname {
        font-size: 16px;
        display: inline-block;
        vertical-align: middle;
      }
      .gender {
        margin-left: 5px;
        height: 18px;
        display: inline-block;
        vertical-align: middle;
      }
      margin-bottom: 5px;
    }
    .from {
      font-size: 12px;
      .time {
        display: inline-block;
        margin-right: 10px;
        color: #aaa;
      }
      .school {
        display: inline-block;
        color: #aaa;
      }
    }
  }
  .right {
    float: right;
  }
}
</style>