<template lang="pug">
.browser-page
  page-base(:title='title')
    back-btn(slot='left')
    .wrap
      mt-progress.progress(v-if='progress < 100', :value='progress')
      iframe(v-el:iframe, :src='url', sandbox='allow-same-origin allow-scripts allow-forms', @load='onLoad')
</template>
<script>
export default { // 发现页  意见反馈和加入我们用的浏览器页面  传入标题 和 url
  computed: {
    initUrl () {
      const p = this.$route.params
      return p.protocol + '://' + p.url
    },
    iframe () {
      return this.$els.iframe
    },
    title () {
      let query = this.$route.query
      if (query.title) {
        return query.title
      } else {
        return this.ititle
      }
    },
    progress () {
      if (this.loading) {
        this.tick
        return (1 - 1 / (this.tick / 10)) * 80 + 10
      } else {
        return 100
      }
    }
  },
  data () {
    return {
      url: '',
      ititle: '',
      progress: 0,
      tick: 0,
      loading: true
    }
  },
  created () {
    this.iid = setInterval(() => {
      this.tick++
    }, 100)
  },
  beforeDestroy () {
    clearInterval(this.iid)
  },
  route: {
    data () {
      this.iframe.onreadystatechange = this.onreadystatechange
      // console.log(this.iframe.onreadystatechange)
      this.url = this.initUrl
      this.loading = true
    }
  },
  methods: {
    getTitle () {
      try {
        return this.iframe.contentWindow.document.title
      } catch (e) {
        return ''
      }
    },
    onLoad () {
      this.loading = false
      this.ititle = this.getTitle()
      console.log('browser onload', this.iframe.src)
    },
    onreadystatechange () {
      console.log('change')
    }
  }
}
</script>
<style lang="less" scoped>
.browser-page {
  .wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }
  iframe {
    border: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
  .progress {
    position: absolute;
    width: 100%;
    height: 3px;
    top: 0;
  }
}
</style>