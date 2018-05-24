<template lang="pug">
  .file-item
    img(:src='icon')
    div.detail
      div.name(v-text='name')
      div.filesize(v-show='displaySize!=""', v-text='displaySize')
</template>



<script>
import { getTypeUrl, folderIcon, displaySize } from 'utils/file'
export default { // 文件列表里有文件夹和文件两种资料  这是文件的item  会显示 文件图标 文件名 和 文件大小
  name: 'file-item',
  props: {
    name: {
      required: true
    },
    size: {
      default: 0
    },
    isFolder: {
      default: false
    }
  },
  computed: {
    displaySize () {
      if (this.isFolder) {
        return ''
      }
      return displaySize(this.size)
    },
    icon () {
      if (this.isFolder) {
        return folderIcon
      }
      return getTypeUrl(this.name)
    }
  }
}
</script>

<style lang='less' scoped>
div {
  box-sizing: border-box;
}
.file-item {
  position: relative;
  padding: 10px;
  height: 70px;

  &:before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
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

    .filesize {
      text-align: right;
      color: gray;
      font-size: 0.9em;
    }
    .name {
      font-size: 1em;
      overflow: hidden; // overflow 文字太长溢出时 溢出的文字隐藏
      white-space: nowrap; // white-space 文字不换行
      text-overflow: ellipsis;
    }
  }
}
</style>