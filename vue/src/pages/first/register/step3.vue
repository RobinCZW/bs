<template lang="pug">
.step3
  group.first-group
    .hint1 学习资料仅供大学生下载
    .hint2 因此需要验证大学生身份
    img.hint-img(src='~assets/icon/register/student.png')
    x-input(:value.sync='schoolUn', placeholder='教务处帐号')
    x-input(:value.sync='schoolPw', type='password', placeholder='教务处密码')
  prompt(v-for='(key, val) in prompt', :name='key', :data='val', :value.sync='input[key]', @click='onReset')
  group
    x-button.blue(@click='step3') 下一步
</template>

<script>
import Group from 'vux-components/group'
import Prompt from './prompt'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
export default { // 验证教务处账号密码的   暂时不做验证了
  components: {
    Group,
    Prompt,
    XInput,
    XButton
  },
  data () {
    return {
      schoolUn: '',
      schoolPw: '',
      input: {}
    }
  },
  props: {
    prompt: {
      default: null
    }
  },
  computed: {
    schoolMore () {
      if (this.prompt) {
        return this.input
      } else {
        return null
      }
    }
  },
  methods: {
    step3 () {
      this.$emit('info', {
        schoolUn: this.schoolUn,
        schoolPw: this.schoolPw,
        schoolMore: this.schoolMore
      })
      this.$emit('register')
    },
    onReset () {
      this.$emit('reset')
    }
  },
  watch: {
    prompt () {
      this.input = {}
    }
  }
}
</script>

<style lang="less">
.first-group {
  .vux-no-group-title::before {
    display: none;
  }
}
</style>
<style lang="less" scoped>
.step3 {
  .blue {
    background-color: #508cee;
    color: #fff;
  }
  .blue:active {
    background-color: #407cde;
  }
  .hint1 , .hint2 {
    text-align: center;
  }
  .hint1 {
    margin: 3% 0;
  }
  .hint2 {
    font-size: 80%;
  }
  .hint-img {
    display: block;
    margin:0 auto;
    margin-bottom: 10%;
  }
}
</style>