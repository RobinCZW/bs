<template lang="pug">
div
  .academy-picker(v-transfer-dom)
    popup.popup(:show.sync='visible', position='top')
      page-scroll(title='选择专业', :watch-data='watchData')
        cross-btn(slot='left')
        loading(:show.sync='loading', text='加载中...')
        .acadmy-list
          mt-cell(v-for='item in academyList', :title='item.name', @click='clickAcademy(item)', is-link)
</template>
<style lang="less" scoped>
.academy-picker {
  .popup {
  }
}
</style>
<script>
import services from 'utils/services'
import Loading from 'vux-components/loading'
export default { // 发现页点击头像进入个人信息页    修改学院时的页面  向上弹出
  components: {
    Loading
  },
  props: {
    visible: {
      twoWay: true
    },
    academy: {
      default: false
    },
    schoolId: {
      required: true
    }
  },
  data () {
    return {
      academyList: [],
      loading: false
    }
  },
  computed: {
    watchData () {
      return [this.academyList]
    }
  },
  methods: {
    onClose () {
      window.history.back()
    },
    clickAcademy (item) {
      // this.visible = false
      this.$emit('academy', item)
      this.onClose()
    }
  },
  watch: {
    visible (val) {
      if (val) {
        let query = this.$route.query
        query.academypicker = 1
        this.$router.go({
          query: query
        })
      }
    },
    '$route.query.academypicker': function (val) {
      if (val) {
        this.loading = true
        return services.school.listAcademy(this.schoolId)
          .then(r => {
            this.academyList = r
            this.loading = false
          })
          .catch(() => this.loading = false)
      } else {
        this.visible = false
      }
    }
  }
}
</script>