<template lang="pug">
.file-detail
  page-base(title='文件详情')
    cross-btn(v-if='!back', slot='left')
    back-btn(v-if='back', slot='left')
    slot(name='right', slot='right')
    .container
      .detail
        .file-info
          img.icon(:src='iconUrl')
          .name(v-text='file.name')
          .from(v-if='file.nick', v-text='file.nick')
        .file-info-center
          .time(v-if='file.ctime', v-text='file.ctime | dateFormat')
          .size(v-if='displaySize', v-text='displaySize')
        .hint
          p 文件存储位置: sd卡/期末考啦/
          p (建议使用WPS打开文档)
      .footer(v-if='downloading')
        mt-progress.progress(:value='progress')
          div(slot='start') 0%
          div(slot='end') 100%
      .footer(v-if='!downloading')
        button.blue(v-if='canOpen', @click="onOpen") 打开文件
        button.blue(v-if='!canOpen', @click="$emit('download')") 下载到手机
        // 下载的操作向父组件提交 download 其实现在父组件file.vue里
        button.white(@click="onSendPC") 发送到电脑
</template>
<script>
import PageBase from 'components/page-base'
import CrossBtn from 'components/cross-btn'
import BackBtn from 'components/back-btn'
import moment from 'moment'
import services from 'utils/services'
import { getTypeUrl, displaySize } from 'utils/file'
import { sendToMyCompouter, openWithUrl } from 'utils/fileop'
// window.sendToMyCompouter = sendToMyCompouter
export default { // 课程列表内的 文件详情pop页             已下载页 也用到了该子组件
  name: 'file-detail',
  filters: {
    dateFormat (t) {
      return moment(t).format('YYYY-MM-DD')
    }
  },
  components: {
    PageBase,
    CrossBtn,
    BackBtn
  },
  props: {
    file: {
      required: true
    },
    back: {
      default: false
    }
  },
  methods: {
    onOpen () { // 打开文件
      try {
        openWithUrl(this.task.nativeURL) // 直接通过nativeURL打开本地文件, 另外调用父组件open更新lastOptionTime
        this.$emit('open')
      } catch (e) {
        services.utils.toast(e.message)
      }
    },
    onSendPC () {
      try {
        let nameEncoded = encodeURIComponent(this.file.name)
        let toPCUrl = `https://finalexam.cn/api/dbfs/md5/${this.file.md5}/${nameEncoded}` // 文件下载链接  固定api头 md5值 文件名
        sendToMyCompouter(`${this.file.name}: ${toPCUrl}`, toPCUrl)
      } catch (e) {
        services.utils.toast(e.message)
      }
    }
  },
  computed: {
    iconUrl () {
      return getTypeUrl(this.file.name)
    },
    displaySize () {
      if (!this.file.size) return null
      return displaySize(this.file.size)
    },
    task () {
      return services.download.byMd5[this.md5]
    },
    md5 () {
      return this.file.md5
    },
    status () {
      if (this.task) {

      } else {
        return null
      }
    },
    canOpen () {
      return this.task && this.task.nativeURL !== ''
    },
    downloading () {
      return this.task && this.task.nativeURL === ''
    },
    progress () {
      if (this.task) {
        let progress = this.task.progress
        if (progress.total !== 0) {
          return progress.loaded / progress.total * 100
        }
      }
      return 0
    }
  }
}
</script>
<style lang="less" scoped>
.file-detail {
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: #fff;

    .detail {
      position: relative;
      flex: auto;
      .file-info , .file-info-center {
        padding-top: 8vmin;
        text-align: center;
        font-size: 0.8em;
        .icon {
          display: block;
          width: 33vmin;
          margin: 0 auto;
        }
        .name {
          font-size: 1.5em;
          margin: 10px 0;
        }
        .from:before {
          content: "分享者: @";
        }
        .time:after {
          content: " 上传";
        }
        .size:before {
          content: "大小: ";
        }
      }
      .file-info-center {
        margin-bottom: 20px;
      }
      .hint {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 14px;
      }
    }
    .footer {
      background-color: #f9f9f9;
      flex: none;
      display: flex;
      justify-content: space-between;
      padding: 5px 10%;
      .progress {
        width: 100%;
      }

      button {
        display: block;
        appearance: none;
        background-color: rgba(0, 0, 0, 0);
        border: 1px solid #000;
        border-radius: 5px;
        width: 45%;
        flex: none;
        padding: 15px 10px;
        font-weight: bold;
        position: relative;
      }
      button.blue {
        border-width: 0;
        color: #fff;
        background-color: rgb(78,141,238);
      }
      button.white {
        border-color: rgb(67,185,223);
        color: rgb(67,185,223);
        background-color: #fff;
      }
      button:before {
      }
      button:active:before {
        content: " ";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        background-color: rgba(0,0,0,0.3);
        border-radius: 5px;
      }
    }
  }
}
</style>