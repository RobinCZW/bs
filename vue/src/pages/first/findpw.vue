<template lang="pug">
.findpw-frag
  page-base(title='找回密码')
    back-btn(slot='left')
    .scroll-layout
      .container
        loading(:show='loading', text='请稍候...')
        .form
          sms-check(v-ref:sms)
            x-input(slot='after', :value.sync='password', placeholder='新密码, 长度不小于6位', type='password')
          group
            x-button.blue(@click='login') 下一步
</template>

<script>
import Group from 'vux-components/group'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
import Loading from 'vux-components/loading'
import services from 'utils/services'

export default { // 点击找回密码后  找回密码的页面
  components: {
    Group,
    XInput,
    XButton,
    Loading
  },
  ready () {
    // this.$refs.phone
  },
  methods: {
    login () {
      // if (this.$refs.sms.check)
      const sms = this.$refs.sms
      const username = sms.phone

      if (username.length === 0) {
        services.utils.toast('请输入手机号')
        return
      }
      if (this.password.length < 6) {
        services.utils.toast('请输入6位以上新密码')
        return
      }
      this.loading = true
      return sms.check()
        .then(() => services.user.resetpw(username, this.password))
        .then(() => services.user.login(username, this.password))
        .then(r => {
          this.$router.go({
            name: 'home'
          })
        })
        .catch(e => {
          console.log('login err:', e)
          // this.$dispatch('toast', '登录失败: ' + e.message)
        })
        .then(() => this.loading = false)
    }
  },
  data () {
    return {
      loading: false,
      password: ''
    }
  }
}
</script>

<style lang="less" scoped>
.findpw-frag {
  height: 100%;
  .scroll-layout {
    overflow-y: auto;
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    display: table;
    .form {
      vertical-align: middle;
      display: table-cell;
      .forgotpw {
        margin: 0 auto;
        text-align: center;
        padding: 5px;
        color: rgb(80, 140, 238);
        width: 6em;
      }
      .blue {
        background-color: #508cee;
        color: #fff;
      }
      .blue:active {
        background-color: #407cde;
      }
    }
  }
}
</style>