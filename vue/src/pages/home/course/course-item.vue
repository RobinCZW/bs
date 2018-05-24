<template lang="pug">
a.course-item(:course-name='course.name')
  .icon(v-text='course.name[0]')
  .name(v-text='course.name')
  img.right-icon(:src='rightIcon', :course-name='course.name')
</template>

<script>
export default { // 课程列表的每个item的样式
  props: {
    course: {
      required: true
    }
  },
  computed: {
    rightIcon () {
      if (this.course.top) {
        return require('assets/icon/top.png') // 未收藏
      } else {
        return require('assets/icon/totop.png') // 已收藏
      }
    }
  }
}
</script>

<style lang="less">
.course-item {
  height: 40px;
  line-height: 40px;
  font-size: 1em;
  padding: 7px;
  padding-left: 47px;
  padding-right: 47px;
  position: relative;
  overflow: hidden;
  display: block;
  .right-icon {
    float: right;
    width: 40px;
    height: 40px;
    display: inline-block;
    box-sizing: border-box;
    margin-right: -40px;
  }

  &:active {
    background-color: #d9d9d9;
  }

  &:after {
    content: " ";
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 bottom;
    transform: scaleY(0.5);
    left: 15px;
  }
  
  .icon {
    float: left;
    display: inline-block;
    box-sizing: border-box;
    margin-left: -40px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #508CEE;
    vertical-align: middle;
    text-align: center;
    pointer-events: none;
    &::first-letter {
      font-size: 20px;
      color: #fff;
    }
  }
  .name {
    box-sizing: border-box;
    width: 100%;
    padding-left: 5px;
    pointer-events: none;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>