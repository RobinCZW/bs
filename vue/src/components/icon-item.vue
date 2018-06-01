<template lang="pug">
div
  vue-ripple
    .icon-item
      img(:src='icon')
      .detail
        .name(v-text='name')
        slot
          .desc
            .lb(v-text='lb')
            .rb(v-text='rb')
            .clear
</template>

<script>
import VueRipple from 'components/vue-ripple'
const unknownIcon = require('assets/icon/file/other.png')
export default { // 已下载页面 的每个item 以及 学生圈每个频道的item      都是一个图标 两行字 复用了
  name: 'icon-item',
  components: {
    VueRipple
  },
  props: {
    name: {
      required: true
    },
    lb: {
      default: ''
    },
    rb: {
      default: ''
    },
    icon: {
      default: unknownIcon
    }
  }
}
</script>

<style scoped lang='less'>
div {
  box-sizing: border-box;
}
.icon-item:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  border-top: 1px solid #D9D9D9;
  color: #D9D9D9;
  transform-origin: 0 bottom;
  transform: scaleY(0.5);
}
.icon-item {
  position: relative;
  padding: 10px;
  height: 70px;
  img {
    display: inline-block;
    height: 50px;
  }
  .detail {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 60px;
    padding: 10px;

    .desc {
      padding-top: 8px;
      .lb {
        text-align: left;
        color: gray;
        font-size: 0.9em;
        float: left;
        
        white-space: nowrap;
        overflow: hidden;
      }
      .rb {
        text-align: right;
        color: gray;
        font-size: 0.9em;
        float: right;
      }
      .clear {
        clear: both;
      }
    }
    .name {
      font-size: 1em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>