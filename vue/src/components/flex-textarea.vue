<template lang="pug">
textarea(rows='1', v-el:text, v-model='value', :placeholder='placeholder')
</template>

<script>
export default { // 学生圈帖子  发表评论的时候 的输入区域
  name: 'flex-textarea',
  props: {
    value: {
      twoWay: true
    },
    placeholder: {
      default: ''
    },
    height: {
      twoWay: true
    }
  },
  data () {
    return {
      // scrollHeight: 20
    }
  },
  watch: {
    value () {
      let text = this.$els.text
      // this.scrollHeight = text.scrollHeight
      text.style.height = 'auto'
      text.style.height = `${text.scrollHeight}px`
      this.height = text.scrollHeight
    }
  },
  methods: {
    focus () {
      let text = this.$els.text
      if (document.activeElement && document.activeElement !== text) {
        document.activeElement.blur()
      }
      text.focus()
      if (window.cordova) {
        window.cordova.plugins.Keyboard.show()
      }
    }
  },
  ready () {
    let text = this.$els.text
    text.style.height = 'auto'
    text.style.height = `${text.scrollHeight}px`
    this.height = text.scrollHeight
  }
}
</script>

<style lang="less" scoped>
textarea {
  appearance: none;
  border: none;
  margin: 0;
  padding: 0;
  outline: none;
  box-sizing: border-box;
  white-space: pre-wrap;
  width: 100%;
  overflow: hidden;
  display: block;
  resize: none;
  font-size: 18px;
  overflow-y: hidden;
  height: auto;
}
</style>