<template lang="pug">
.search-box
  .mask
    .placeholder(v-text='placeholderText', :style='widthStyle')
  .clear(v-show='!empty', @click="value=''")
    .cross
  input(type='text', v-model='value', @focus='onFocus', @blur='onBlur')
</template>

<script>
export default { // 课程列表 搜索课程使用的搜索框
  name: 'search-box',
  props: {
    value: {
      twoWay: true
    },
    placeholder: {
      default: '搜索'
    }
  },
  data () {
    return {
      focused: false
    }
  },
  methods: {
    onFocus () {
      this.focused = true
      this.$el.setAttribute('focused', '')
      this.$emit('focus')
    },
    onBlur () {
      this.focused = false
      this.$el.removeAttribute('focused')
      this.$emit('blur')
    }
  },
  computed: {
    widthStyle () {
      let width = '100%'
      if (this.empty && !this.focused) {
        width = `${this.placeholder.length + 2}em`
      }
      return {
        width
      }
    },
    placeholderText () {
      return this.empty ? this.placeholder : ''
    },
    empty () {
      let empty = this.value.length === 0
      if (empty) {
        this.$el.setAttribute('empty', '')
      } else {
        this.$el.removeAttribute('empty')
      }
      return empty
    }
  }
}
</script>

<style lang="less" scoped>
div {
  box-sizing: border-box;
}
.icon {
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  background-image: url("~assets/icon/search.png");
  background-size: 1.2em;
  background-repeat: no-repeat;
  vertical-align: middle;
  margin-left: 0.3em;
  margin-right: 0.5em;
}
.search-box {
  height: 46px;
  padding: 5px;
  position: relative;
  .clear {
    position: absolute;
    right: 10px;
    top: 5px;
    width: 30px;
    height: 30px;
    .cross {
      margin-top: 3px;
      width: 100%;
      height: 100%;
      border-radius: 100%;
      background-color: #aaa;
      transform: scale(0.5);
      position: relative;
      .half-cross {
        width: 8px;
        height: 8px;
        border: 4px solid #fff;
        border-right: 0;
        border-bottom: 0;
        top: 13px;
        left: 13px;
        transform-origin: 2px 2px;
      }
      &::before {
        position: absolute;
        content: " ";
        display: block;
        .half-cross;
        transform: rotate(45deg);
      }
      &::after {
        position: absolute;
        content: " ";
        display: block;
        .half-cross;
        transform: rotate(225deg);
      }
    }
  }
  .mask {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    text-align: center;
    padding: 5px;
    .placeholder::before {
      .icon;
      content: " ";
    }
    .placeholder {
      line-height: 36px;
      height: 100%;
      font-size: 16px;
      display: inline-block;
      transition: all .3s ease;
      text-align: left;
      margin: 0 3px;
      color: #aaa;
      width: 100%;
      overflow: visible;
      white-space: nowrap;
    }
  }
  &>input {
    padding-left: 2em;
    box-sizing: border-box;
    appearance: none;
    border: 2px solid #f0f0f0;
    border-radius: 5px;
    height: 100%;
    width: 100%;
    background-color: #f0f0f0;
    font-size: 16px;
  }
}
.search-box {
  .mask {
    .placeholder {
    }
  }
}
</style>