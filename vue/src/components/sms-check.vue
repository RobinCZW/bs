<template lang="pug">
.sms-check
  group
    slot(name='before')
    x-input(:value.sync='phone', placeholder='输入手机号码', type='number', is-type='china-mobile', v-ref:phone)
    .inline
      .div-line
      .inline-input
        x-input(:value.sync='code', placeholder='输入短信验证码')
      .vline
      button.inline-btn(:style='codeStyle', @click='sendCode') {{ codeHint }}
      .clear
    slot(name='after')
</template>

<script>
import Group from 'vux-components/group'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
import services from 'utils/services'

export default { // 找回密码时   输入手机号 以及 输入验证码的 控件组合
  name: 'sms-check',
  components: {
    Group,
    XInput,
    XButton
  },
  computed: {
    codeHint () {
      if (this.codeCooldown <= 0) {
        return '发送验证码'
      } else {
        return `重新发送 (${this.codeCooldown})`
      }
    },
    codeStyle () {
      return {
        color: this.codeCooldown <= 0 ? '#000' : '#D9D9D9'
      }
    }
  },
  data () {
    return {
      codeCooldown: 0,
      phone: '',
      password: '',
      code: '',
      sentPhone: '?',
      codeOk: false
    }
  },
  methods: {
    sendCode () {
      if (this.codeCooldown <= 0) {
        this.codeCooldown = 60
        let id = setInterval(() => {
          this.codeCooldown--
          if (this.codeCooldown <= 0) {
            clearInterval(id)
          }
        }, 1000)
        this.sentPhone = this.phone
        // send
        return services.sms.send(this.phone)
          .catch(() => {
            this.codeCooldown = 0
          })
      }
    },
    check () {
      return services.sms.verify(this.code)
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
.sms-check {
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