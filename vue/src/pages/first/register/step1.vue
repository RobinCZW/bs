<template lang="pug">
.step1
  group
    x-input(:value.sync='phone', placeholder='输入手机号码', type='number', is-type='china-mobile', v-ref:phone)
    //- .inline
    //-   .div-line
    //-   .inline-input
    //-     x-input(:value.sync='code', placeholder='输入短信验证码')
    //-   .vline
    //-   button.inline-btn(:style='codeStyle', @click='sendCode') {{ codeHint }}
    //-   .clear
    x-input(:value.sync='password', type='password', placeholder='输入密码, 长度不小于6位')
  group
    x-button.blue(@click='step1') 下一步
</template>

<script>
import Group from 'vux-components/group'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
import services from 'utils/services'

export default {
  components: {
    Group,
    XInput,
    XButton
  },
  computed: { // 计算属性
    codeHint () { // 发送验证码 点击后 会变成 重新发送 字样 并倒计时一分钟
      if (this.codeCooldown <= 0) {
        return '发送验证码'
      } else {
        return `重新发送 (${this.codeCooldown})`
      }
    },
    codeStyle () { // 倒计时时 字体变灰色
      return {
        color: this.codeCooldown <= 0 ? '#000' : '#D9D9D9'
      }
    }
  },
  data () {
    return {
      codeCooldown: 0, // 短信倒计时  一分钟只能发一次验证码
      phone: '',
      password: '',
      code: '',
      sentPhone: '?', // 标记是否点了 发送验证码 按钮
      codeOk: false
    }
  },
  methods: {
    sendCode () { // 发送验证码
      if (this.codeCooldown <= 0) { // 倒计时已<=0 可发送短信 执行发送短信操作
        this.codeCooldown = 60
        let id = setInterval(() => {
          this.codeCooldown--
          if (this.codeCooldown <= 0) {
            clearInterval(id)
          }
        }, 1000) // 每1000毫秒 倒计时 减1
        this.sentPhone = this.phone
        // send
        return services.user.sendCode(this.phone) // 调用阿里通信接口 发送验证码
          .catch(() => {
            this.codeCooldown = 0
          })
      }
    },
    step1 () { // 点击下一步
      let go = () => {
        this.$emit('info', { // 向router.go组件(register的index组件,其实也是step1组件的父组件)  提交 info动作  并提供参数为 setp 2
          phone: this.phone,
          password: this.password
        })
        this.$router.go({ // 跳转到第二步
          query: {
            step: 2,
            action: 'register' // action参数为register而已 不是跳到register.vue
          }
        })
      }
      // if (this.sentPhone !== this.phone) { // 没点发送验证码提示
      //   services.utils.toast('请发送验证码')
      //   return
      // }

      if (this.password.length < 6) { // 密码不足6位
        services.utils.toast('密码长度不足6位')
        return
      }

      if (this.codeOk) {
        go()
        return
      }

      // return services.user.checkCode(this.code) // 验证验证码是否正确
      //   .then((r) => {
      //     this.codeOk = r.ok
      //     if (r.ok) {
      //       go()
      //     } else {
      //       services.utils.toast('手机验证码错误')
      //     }
      //   })

      go() // 不进行验证码验证  直接进入下一步完善信息  最后(index.vue register(data))
      return
    }
  },
  watch: {
    phone () {
      this.codeOk = false
    }
  }
}
</script>

<style lang="less" scoped>
.step1 {
  .blue {
    background-color: #508cee;
    color: #fff;
  }
  .blue:active {
    background-color: #407cde;
  }
  .inline {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    .div-line {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 1px;
      border-top: 1px solid #D9D9D9;
      color: #D9D9D9;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      left: 15px;
    }
    .inline-input {
      display: block;
      flex-grow: 1;
    }
    .vline {
      flex: 0 0 1px;
      display: flex;
      align-items: center;
    }
    .vline:before {
      content: " ";
      width: 1px;
      height: 30px;
      background-color: #D9D9D9;
    }
    .inline-btn {
      display: block;
      padding: 0 5px;
      border-width: 0;
      background-color: rgba(0,0,0,0);
      white-space: nowrap;
      font-size: inherit;
    }
    .clear {
      clear: both;
    }
  }
}
</style>