<template lang="pug">
page-scroll(title='发动态', :loading-text='loadingText', :loading='sending', :watch-data='watchData')
  cross-btn(slot='left')
  .submit-send(slot='right', @click='submitSend') 发送
  group
    x-textarea(placeholder='说点什么吧...', :max='140', :value.sync='content', v-ref:text)
    switch(title='匿名发送', :value.sync='anonymous')
  group
    .upload
      pic-preview.pic(v-for='img in images', :src='img.src')
      input-file.add(v-show='images.length < 9', :src='uploadSrc', @file='onFile', :no-data='true', @readbegin='onRead', @readend='onReadEnd')
</template>

<script>
import XTextarea from 'vux-components/x-textarea'
import Switch from 'vux-components/switch'
import Group from 'vux-components/group'
import services from 'utils/services'
const uploadSrc = require('assets/icon/xsq/upload.png')
const URL = window.URL || window.webkitURL
export default {
  components: {
    XTextarea,
    Switch,
    Group
  },
  data () {
    return {
      anonymous: true,
      content: '',
      sending: false,
      images: [],
      loadingText: '正在发送',
      uploadSrc: uploadSrc
    }
  },
  props: {
    tid: {
      required: true
    }
  },
  methods: {
    clear () { // 删除所有已编辑的内容 包括文字和图片
      for (let img of this.images) {
        URL.revokeObjectURL(img.src)
        img.blob = null
      }
      this.content = ''
      this.images = []
    },
    onRead () {
      this.loadingText = '正在读取'
      this.sending = true
    },
    onReadEnd () {
      this.sending = false
    },
    submitSend () { // 发布帖子
      let hasImg = this.images.length > 0
      if (this.content.length === 0) { // 判断内容是否为空
        if (hasImg) {
          this.content = '分享图片'
        } else {
          services.utils.toast('写点东西呗')
          return
        }
      }
      this.sending = true

      let chain = Promise.resolve([]) // default imglist
      if (hasImg) {
        this.loadingText = '正在上传图片'
        chain = chain.then(this.uploadImages)
      }
      chain = chain.then(imgs => {
        console.log('imgs: ', imgs, hasImg)
        this.loadingText = '正在发送'
        return services.xsq.sendFeed(this.tid, this.content, this.anonymous, imgs)
      }).then(() => {
        this.sending = false
        window.history.back()
        this.$emit('send')
      })
      return chain
    },
    uploadImages () { // 点击上传图片
      let images = this.images.map(i => i.blob)
      return services.xsq.uploadImages(images)
    },
    onFile (filelist) { // ???? 选择图片时  图片就是file
      for (let i = 0; i < filelist.length; i++) {
        let file = filelist[i]
        console.log('choose file', file)
        let url = URL.createObjectURL(file)
        this.images.push({
          src: url,
          blob: file
        })
      }
    },
    focusText (e) { // 聚焦文本框 弹出键盘
      let text = this.$refs.text.$el.children[0].children[0]
      if (document.activeElement && document.activeElement !== text) {
        document.activeElement.blur()
      }
      text.focus()
      if (window.cordova) {
        window.cordova.plugins.Keyboard.show()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.submit-send {
  color: #fff;
}
.upload {
  margin: 10px;
  .pic , .add {
    display: inline-block;
    width: 30%;
    margin-right: 3%;
  } 
}
</style>