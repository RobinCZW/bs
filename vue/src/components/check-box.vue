<template lang="pug">
label.check-box
  input(type='checkbox', v-model='value')
  span
    slot
</template>

<script>
export default { // 评论时, 选择匿名与否的check-box
  name: 'check-box',
  props: {
    value: {
      twoWay: true
    }
  }
}
</script>

<style lang="less" scoped>
.check-box {
    display: inline;
    height: 20px;
    input {
    appearance: none;
    outline: 0;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    &:before {
      content: " ";
      display: block;
      box-sizing: border-box;
      height: 20px;
      width: 20px;
      border: 1px solid #aaa;
      border-radius: 5px;
      margin-right: 5px;
    }
    &:checked:after {
      content: " ";
      position: absolute;
      top: 1px;
      left: 6px;
      width: 6px;
      height: 12px;
      border: 2px solid #508CEE;
      border-left: 0;
      border-top: 0;
      transform: rotate(45deg);
    }
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>

