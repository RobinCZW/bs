<template lang="pug">
.login-frag
  page-base(title='登录')
    back-btn(slot='left')
    .scroll-layout
      .container
        loading(:show='loading', text='登录中...')
        .row
          .form
            group
              x-input(:value.sync='username', placeholder='输入手机号码', type='number', is-type='china-mobile', v-ref:phone)
              x-input(:value.sync='password', placeholder='输入密码, 长度不小于6位', type='password')
            group
              x-button.blue(@click='login') 下一步
            .links
              .forgotpw(@click='forgotPW') 忘记密码?
              .register(@click='goRegister') 没有帐号? 点击注册
              .clear-fix
        .row(style="height: 120px;")
          .bottom
            .tip  快速登录 
            .qq(@click='qqLogin')
</template>

<script>
import Group from 'vux-components/group'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
import Loading from 'vux-components/loading'
import services from 'utils/services'

export default { // 登录页面
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
    goRegister () {
      this.$router.go({
        append: true,
        query: {
          action: 'register'
        }
      })
    },
    forgotPW () {
      // 总有sb会忘记密码.
      this.$router.go({
        append: true,
        query: {
          action: 'findpw'
        }
      })
    },
    qqLogin () { // qq快捷登录
      window.QQSDK.ssoLogin(({
        access_token,
        userid,
        expires_time
      }) => {
        return services.user.oauthLogin('qq', userid, access_token)
        .then(r => {
          console.log('qq', r)
          if (r.CollegeId === null || r.AcademyId === null || r.enterYear === null) {
            // 补充信息
            this.$router.go({
              append: true,
              query: {
                action: 'complete'
              }
            })
          } else {
            // 登录成功
            this.$router.go({
              name: 'home'
            })
          }
        })
      })
    },
    login () {
      if (this.username.length === 0) {
        services.utils.toast('请输入手机号')
        return
      }
      if (this.password.length === 0) {
        services.utils.toast('请输入密码')
        return
      }
      this.loading = true
      return services.user.login(this.username, this.password)
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
      username: '',
      password: ''
    }
  }
}
</script>

<style lang="less" scoped>
.login-frag {
  height: 100%;
  .scroll-layout {
    overflow-y: auto;
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    display: table;
    .row {
      display: table-row;
    }
    .bottom {
      display: table-cell;
      .qq {
        width: 60px;
        height: 60px;
        background-image: url("~assets/icon/login_qq.png");
        background-size: 60px;
        margin: 0 auto;
      }
      .tip {
        margin: 0 auto;
        width: 80%;
        text-align: center;
        margin-bottom: 10px;
        &:before , &:after {
          content: " ";
          display: inline-block;
          background: #bbb; //rgb(80, 140, 238);
          height: 1px;
          width: 35%;
          vertical-align: middle;
        }
      }
    }
    .form {
      vertical-align: middle;
      display: table-cell;
      .links {
        color: rgb(80, 140, 238);
        .forgotpw {
          margin: 0 auto;
          text-align: center;
          padding: 5px;
          padding-left: 10px;
          //width: 6em;
          float: left;
        }
        .register {
          float: right;
          padding: 5px;
          padding-right: 10px;
        }
      }
      .blue {
        background-color: #508cee;
        color: #fff;
      }
      .blue:active {
        background-color: #407cde;
      }
      .quick-group {
        margin-top: 20%;
      }
    }
  }
}
</style>