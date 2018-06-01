<template lang="pug">
  div.dropdown
    .largetouch(@click='popupShow=true')
    school-picker(:visible.sync='popupShow', @school='onSelect')
      .popup fuck
    div.text {{ select.name }}
    .btn
      img(:src="btnImg")
</template>

<script>
// import Popup from 'vux-components/popup'
import SchoolPicker from 'components/school-picker'
var btnImg = require('assets/button/choose_school_white.png')
export default { // 切换学校的控件
  name: 'dropdown',
  components: {
    SchoolPicker
  },
  methods: {
    onSelect (school) {
      this.select = school
    }
  },
  data: () => ({
    btnImg,
    popupShow: false, // 选择学校的下拉列表页面是否显示   上面的dropdown按钮点击后会改为true 触发school-picker模块显示 school-picker在components里看
    value: []
  }),
  props: {
    select: {
      twoWay: true
    }
  }
}
</script>

<style scoped lang="less">
.dropdown {
  position: relative;
  left: -10px;

  width: 40vw;
  height: 20px;

  .largetouch {
    position: absolute;
    margin-top: -20px;
    margin-left: -10px;
    height: 50px;
    width: 45vw;
  }

  .popup {
    width: 100%;
    height: 50%;
    color: #000;
  }

  .text {
    color: #fff;
    font-size: 120%;

    display: inline-block;
    height: 20px;
    float: left;
    max-width: calc(100% - 20px);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn {
    display: inline-block;
    float: left;
    height: 20px;
    img {
      margin: auto;
      height: 90%;
    }
  }
}
</style>
