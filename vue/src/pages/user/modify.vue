<template lang="pug">
.user-modify
  image-clipper(v-ref:clipper, :visible.sync='clipper', :src='avatarData', @clip='onClip')
  academy-picker(:visible.sync='academy', :school-id='user.CollegeId', @academy='onAcademy')
  div(v-transfer-dom)
    mt-popup(style='width: 100%;', :visible.sync='yearShow', position='bottom')
      mt-picker(:slots='yearSlot', @change='onYearChange', :visible-item-count='5', v-ref:picker)
  page-scroll(title='个人信息', loading-text='更新中', :loading='loading')
    back-btn(slot='left')
    .info(v-show="status === 'info'", transition='left')
      group
        cell(title='头像', is-link)
          img.icon(src='~assets/icon/user/modify/1.png', slot='icon')
          input-file.avatar(:src='user.avatar', @data='clipAvatar', @readbegin='loading=true', @readend='loading=false')
        cell(title='昵称', :value='user.nickname', is-link, @click='onNickname')
          img.icon(src='~assets/icon/user/modify/2.png', slot='icon')
        cell(title='手机号', :value='user.phone')
          img.icon(src='~assets/icon/user/modify/3.png', slot='icon')
      group
        cell(title='学校', :value='user.collegeName')
          img.icon(src='~assets/icon/user/modify/4.png', slot='icon')
        cell(title='学院', :value='user.academyName', is-link, @click='academy=true')
          img.icon(src='~assets/icon/user/modify/5.png', slot='icon')
        cell(title='性别', :value='user.gender', is-link, @click='onGender')
          img.icon(src='~assets/icon/user/modify/6.png', slot='icon')
        cell(title='入学年份', :value='user.enterYear', is-link, @click='openYear')
          img.icon(src='~assets/icon/user/modify/7.png', slot='icon')
      group
        cell(title='退出登录', is-link, @click='onLogout')
    .gender-edit(v-show="status === 'gender'", transition='right')
      h1 hehe
    .nickname-edit(v-show="status === 'nickname'", transition='right')
      h1 2333
</template>

<script>
import AcademyPicker from './academy-picker'
import Group from 'vux-components/group'
import Cell from 'vux-components/cell'
import { resizeToScreenMax } from 'utils/canvas'
import { dataURLtoBlob } from 'utils/blob'
import services from 'utils/services'
let years = []
const currentYear = (new Date()).getFullYear()
for (let i = currentYear; i > currentYear - 8; i--) {
  years.push(i.toString())
}
export default { // 发现页 点击头像栏 进入我的信息页 可进行修改
  components: {
    AcademyPicker,
    Group,
    Cell
  },
  computed: {
    user () {
      return services.store.user
    },
    status () {
      return this.$route.query.status || 'info'
    }
  },
  data () {
    return {
      academy: false,
      loading: false,
      yearShow: false,
      yearSlot: [{
        values: years
      }],
      enterYear: 0,
      clipper: false,
      avatarData: ''
    }
  },
  methods: {
    onNickname () {
      return services.utils.MessageBox({
        message: '请输入昵称',
        inputValue: this.user.nickname,
        showCancelButton: true,
        showInput: true,
        $type: 'prompt'
      }).then(({ value, action }) => {
        if (action === 'confirm') {
          if (value.length === 0) {
            services.utils.toast('请输入昵称')
            return
          }
          if (value !== this.user.nickname) {
            return services.user.modify({nickname: value})
              .then(services.xsq.updateInfo)
              .then(() => {
                this.user.nickname = value
              })
          }
        }
      })
    },
    onGender () {
      services.utils.MessageBox({
        message: '选择性别',
        showCancelButton: true,
        confirmButtonText: '女',
        cancelButtonText: '男',
        confirmButtonClass: 'msgbox-black',
        cancelButtonClass: 'msgbox-black'
      }).then(r => {
        return r === 'cancel' ? '男' : '女'
      }).then(gender => {
        if (gender !== this.user.gender) {
          return services.user.modify({gender: gender})
            .then(services.xsq.updateInfo)
            .then(() => {
              this.user.gender = gender
            })
        }
      })
    },
    onLogout () {
      services.user.logout()
        .then(services.xsq.logout)
        .then(() => {
          this.$router.go({
            name: 'first'
          })
        })
    },
    onClip (preview) {
      let avatar = dataURLtoBlob(preview)
      this.loading = true
      services.user.uploadAvatar(avatar)
        .then(r => {
          this.user.avatar = r.avatar
        })
        .then(() => services.xsq.uploadAvatar(avatar))
        .then(this.loadEnd, this.loadEnd)
    },
    clipAvatar (src) {
      console.log('clipBegin')
      resizeToScreenMax(src, (r) => {
        console.log('clipEnd')
        this.avatarData = r
        this.clipper = true
      })
    },
    onAcademy (academy) {
      console.log(academy)
      this.loading = true
      if (academy.id !== this.user.AcademyId) {
        return services.user.modify({AcademyId: academy.id})
          .then(() => {
            this.user.AcademyId = academy.id
            this.user.academyName = academy.name
          })
          .then(this.loadEnd, this.loadEnd)
      }
    },
    onYearChange (picker, values) {
      this.enterYear = values[0]
    },
    loadEnd () {
      this.loading = false
    },
    openYear () {
      let enterYear = this.user.enterYear
      if (enterYear !== 0) {
        this.$refs.picker.setValues([enterYear])
      }

      let query = this.$route.query
      query.pickyear = 1
      this.$router.go({
        query: query
      })
      this.yearShow = true
    }
  },
  watch: {
    yearShow (val) {
      if (!val) {
        if (this.$route.query.pickyear) {
          window.history.back()
        }
        if (this.enterYear !== this.user.enterYear) {
          this.loading = true
          return services.user.modify({enterYear: this.enterYear})
            .then(() => {
              this.user.enterYear = this.enterYear
            })
            .then(this.loadEnd, this.loadEnd)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.user-modify {
  .info {
    .avatar {
      display: inline-block;
      vertical-align: middle;
      width: 60px;
      height: 60px;
      border-radius: 5px;
    }
    .icon {
      vertical-align: middle;
      display: inline-block;
      height: 30px;
      margin-right: 5px;
    }
  }
}
</style>
<style>
.msgbox-black {
  color: #000;
}
</style>