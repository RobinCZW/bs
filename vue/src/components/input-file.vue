<template lang="pug">
.input-file
  .cordova(v-if='cordova', @click='onClick')
  input(v-else, type='file', @change='onChange')
  img(:src='src')
  //image/*;capture=camera  accept='image/*', 
</template>

<script>
import { dataURLtoBlob } from 'utils/blob' // 注册时传头像 修改头像时传头像 学生圈发帖时加照片 用到的上传文件的控件
const FileReader = window.FileReader
const cordova = !!window.cordova
export default {
  name: 'input-file',
  data () {
    return {
      cordova: cordova
    }
  },
  props: {
    src: String,
    noData: {
      default: false
    },
    skipBlob: {
      default: false
    }
  },
  methods: {
    onClick () {
      if (window.cordova) {
        // navigator.camera.getPicture(r => {
        //   console.log('r', r)
        //   window.resolveLocalFileSystemURL(r, f => {
        //     f.file(file => {
        //       // console.log('file', file, f)
        //       // if (this.skipBlob) {
        //       //   this.$emit('file', [file])
        //       // }
        //       this.$emit('readbegin')
        //       let reader = new FileReader()
        //       reader.onload = () => {
        //         if (!this.skipBlob) {
        //           let blob = dataURLtoBlob(reader.result)
        //           this.$emit('readend')
        //           console.log('file blob', blob)
        //           this.$emit('file', [blob])
        //         }
        //         if (this.noData) return
        //         this.$emit('data', reader.result)
        //       }
        //       reader.onerror = e => {
        //         console.log('reader err ', e)
        //         this.$emit('readend')
        //       }
        //       reader.readAsDataURL(file)
        //     })
        //   })
        // }, e => {
        //   console.log('file input err', e)
        // }, {
        //   sourceType: 0
        // })
        navigator.camera.getPicture(r => {
          r = 'data:image/jpeg;base64,' + r
          this.$emit('readbegin')
          let blob = dataURLtoBlob(r)
          this.$emit('readend')
          console.log('file blob', blob)
          this.$emit('file', [blob])
          if (this.noData) return
          this.$emit('data', r)
        }, e => {
          console.log('file input err', e)
        }, {
          sourceType: 0,
          destinationType: 0,
          allowEdit: false
        })
      } else {
        console.log('no cordova')
      }
    },
    onChange (e) {
      let file = e.target.files || e.dataTransfer.files
      if (file) {
        if (!this.skipBlob) {
          this.$emit('file', file)
        }
        if (this.noData) return
        let reader = new FileReader()
        console.log('reader', reader)
        reader.onload = () => {
          this.$emit('readend')
          // preview.src = reader.result
          this.$emit('data', reader.result)
          e.target.value = ''
        }
        this.$emit('readbegin')
        reader.readAsDataURL(file[0])
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input-file {
  position: relative;
  overflow: hidden;
  .cordova {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  > input[type="file"] {
    font-size: 600px;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
  }
  > img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .preview {

  }
}
</style>