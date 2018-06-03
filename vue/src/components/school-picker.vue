<template lang="pug">
div
  .school-picker(v-transfer-dom)
    popup.popup(:show.sync='visible', position='top')
      page-scroll(:title='title', :top-method='refresh', :watch-data='watchData')
        cross-btn(v-if='page==1', slot='left')
        back-btn(v-if='page>1', slot='left', :on-click='onBack')
        loading(:show.sync='loading', text='加载中...')
        .wrap(:style='switchStyle')
          .list(v-show='page==1', transition='fade')
            mt-cell(v-for='item in list', :title='item.name', @click='clickSchool(item)', is-link)
            // 学校列表
          .acadmy-list(v-show='page==2', transition='fade')
            mt-cell(v-for='item in academyList', :title='item.name', @click='clickAcademy(item)', is-link)
            // 学院列表
          .year-list(v-show='page==3', transition='fade')
            mt-cell(v-for='item in years', :title='item', @click='clickYear(item)', is-link)
            // 入学年份列表
</template>

<script>
import services from 'utils/services'
import Popup from 'components/popup'
import CrossBtn from 'components/cross-btn'
import BackBtn from 'components/back-btn'
import PageScroll from 'components/page-scroll'
import Loading from 'vux-components/loading'
let years = []
const currentYear = (new Date()).getFullYear()
for (let i = currentYear; i > currentYear - 8; i--) {
  years.push(i.toString())
}
export default { // 注册时选择学校 课程列表切换学校 qq快捷注册完善信息选择学校 时用的学校选择器 向上弹起
  name: 'school-picker',
  components: {
    PageScroll,
    CrossBtn,
    BackBtn,
    Popup,
    Loading
  },
  props: {
    visible: {
      twoWay: true
    },
    academy: {
      default: false
    }
  },
  data () {
    return {
      page: 1,
      academyList: [],
      years: years,
      loading: false,
      curSchool: {}
    }
  },
  computed: {
    switchStyle () {
      return {
        transform: `translateX(-${this.page - 1}00%)`
      }
    },
    list () {
      return services.school.store.schoolList
    },
    title () {
      switch (this.page) {
        case 1:
          return '选择学校'
        case 2:
          return '选择专业'
        case 3:
          return '选择入学年份'
      }
    },
    watchData () {
      return [this.list, this.academyList, this.page]
    }
  },
  methods: {
    refresh () {
      return services.school.list()
    },
    onClose () {
      // this.visible = false
      window.history.back()
    },
    onBack () {
      this.page--
    },
    clickSchool (item) {
      this.curSchool = item
      if (this.academy) {
        this.loading = true
        services.school.listAcademy(item.id)
          .then(r => {
            this.academyList = r
            this.page = 2
            this.loading = false
          })
          .catch(r => {
            this.loading = false
          })
      } else {
        this.visible = false
        this.$emit('school', item)
        this.onClose()
      }
    },
    clickAcademy (item) {
      this.curAcademy = item
      this.page = 3
    },
    clickYear (item) {
      this.visible = false
      this.$emit('school', this.curSchool)
      this.$emit('academy', this.curAcademy)
      this.$emit('year', item)
      this.onClose()
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.page = 1
        let query = this.$route.query
        query.schoolpicker = 1
        this.$router.go({
          query: query
        })
      }
    },
    '$route.query.schoolpicker': function (val) {
      if (!val) {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.school-picker {
  .popup {
    .wrap {
      position: relative;
      overflow-x: visible;
      overflow-y: visible;
      width: 100%;
      transition: all .2s ease;
      & > div {
        // position: relative;
        width: 100%;
      }
      .acadmy-list {
        // margin-left: 100%;
        transform: translateX(100%);
      }
      .year-list {
        // margin-left: 200%;
        transform: translateX(200%);
      }
    }
  }
  .fade-transition {
    transition: all .2s ease;
  }
  .fade-enter , .fade-leave {
    opacity: 0;
  }
  .fade-leave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .school-transition {
    transition: all .2s ease;
  }
  .school-enter, .school-leave {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    width: 100%;
    opacity: 0;
  }
  .academy-transition {
    transition: all .2s ease;
  }
  .academy-enter, .academy-leave {
    position: absolute;
    top: 0;
    transform: translateX(50%);
    width: 100%;
    opacity: 0;
  }
}
</style>