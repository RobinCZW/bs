<template lang="pug">
.first-page
  select-action.stack(v-show='action=="select-action"', transition='fade')
  register.stack(v-show='action=="register"', transition='popup')
  login.stack(v-show='action=="login"', transition='popup')
  find-pw.stack(v-show='action=="findpw"', transition='popup')
  complete.stack(v-show='action=="complete"', transition='popup')
</template>
<script>
import Login from './login'
import Register from './register'
import SelectAction from './select'
import FindPw from './findpw'
import Complete from './complete'
import services from 'utils/services'
services
export default { // 启动app 经过splash页 广告页后 如未登录 进入first路径 进入该index.vue 默认action为select-action 显示SelectAction页面
  components: {
    Login, // 登录
    Register, // 注册
    SelectAction, // 原本用来选择 是  登录 还是 注册 的页面   后来删去注册  仅剩登录按钮   注册则藏在登录页面里 一个跳转再去注册 为了配合qq快速登录
    FindPw, // 找回密码
    Complete // qq快速注册后的完善信息  选择学校等
  },
  computed: {
    action () { // 判断到 /first的操作是什么    各个注册页面都是堆叠的子页面 所以各个子页面修改action时  堆叠页面随时调整显示
      let action = this.$route.query.action
      if (['login', 'register', 'findpw', 'complete'].includes(action)) {
        return action
      }
      return 'select-action' // 默认action为 select-action
    }
  },
  route: {
    // activate (transition) {
    //   if (transition.to.path === '/first') {
    //     if (services.user.store.isLogin) {
    //       console.log('login, goto home')
    //       this.$router.replace({
    //         name: 'home'
    //       })
    //       return
    //     }
    //   }
    //   transition.next()
    // }
  }
}
</script>
<style lang="less" scoped>
.first-page {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  .stack {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .popup-transition {
    transition: all .3s ease;
  }
  .popup-enter , .popup-leave {
    transform: translate3d(0,100%,0); 
    // transform: translate3d(100%,0,0);
  }
  .fade-transition {
    transition: all .3s ease;
  }
  .fade-enter {
    opacity: 0;
  }
  .fade-leave {
    opacity: 0;
  }
}
</style>