<template lang="pug">
.complete-frag
  school-picker(:visible.sync='school.show', :academy='true', @school='school.school=$arguments[0]', @academy='school.academy=$arguments[0]', @year='school.enterYear=$arguments[0]')
  page-base(title='完善信息')
    back-btn(slot='left')
    .scroll-layout
      .container
        loading(:show='loading', text='请稍候...')
        group
          .avatar
            img(v-show='userAvatar', :src='userAvatar')
          x-input(:value.sync='nickname', placeholder='填写昵称')
          cell(:title='schoolInfo', is-link, @click='school.show=true')
        group
          radio(:options="['男', '女']", :value.sync='gender')
        group
          x-button.blue(@click='next') 下一步
</template>

<script>
import Group from 'vux-components/group'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
import Loading from 'vux-components/loading'
import Cell from 'vux-components/cell'
import Radio from 'vux-components/radio'
import services from 'utils/services'

export default { // qq快捷注册后 完善学校 昵称 性别 级别 学院 等信息
  components: {
    Group,
    XInput,
    XButton,
    Loading,
    Cell,
    Radio
  },
  ready () {
    // this.$refs.phone
    this.nickname = this.user.nickname
  },
  methods: {
    next () {
      if (this.school.school.id && this.school.academy.id && this.school.enterYear && this.nickname.length > 0) {
        return services.user.modify({
          nickname: this.nickname,
          CollegeId: this.school.school.id,
          AcademyId: this.school.academy.id,
          enterYear: this.school.enterYear,
          gender: this.gender
        }).then(() => services.user.info()).then(() => {
          this.$router.go({
            name: 'home'
          })
        }).catch(e => {
          console.error('complete err', e)
        })
      } else {
        services.utils.toast('请完善信息后登录')
      }
    }
  },
  data () {
    return {
      loading: false,
      nickname: '',
      gender: '',
      school: {
        show: false,
        school: {},
        academy: {},
        enterYear: 0
      }
    }
  },
  computed: {
    schoolInfo () {
      let info = this.school
      let text = ''
      if (info.school.name && info.academy.name) {
        text = `${info.school.name}-${info.academy.name}`
      } else {
        text = '选择学校'
      }
      return text
    },
    userAvatar () {
      const user = services.store.user
      if (user && user.avatar && user.avatar.length > 0) {
        return user.avatar
      } else {
        return null
      }
    },
    user () {
      return services.store.user
    }
  }
}
</script>

<style lang="less" scoped>
.complete-frag {
  height: 100%;
  .scroll-layout {
    overflow-y: auto;
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    display: table;
    .avatar {
      display: block;
      margin: 0 auto;
      width: 100px;
      height: 100px;
      margin-top: 10px;
      margin-bottom: 50px;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
      }
    }
  }
}
</style>