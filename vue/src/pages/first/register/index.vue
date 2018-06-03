<template lang="pug">
.register-frag
  page-base(title='注册')
    back-btn(slot='left')
    loading(text='注册中...', :show='loading')
    .page-switch(:style='switchStyle')
      .scroll-layout
        .container
          .form
            step1(@info='stepInfo')
            // 子组件触发info事件时, 执行stepInfo()
      .scroll-layout
        .container
          .form
            step2(@info='stepInfo', @register='register', v-ref:step2)
      .scroll-layout
        .container
          .form
            step3(@info='stepInfo', @register='register', @reset='onReset', :prompt='prompt')
            // step3废弃 所有含prompt都废弃
</template>

<script>
import Loading from 'vux-components/loading'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import services from 'utils/services'
import { dataURLtoBlob } from 'utils/blob'

export default { // 整个注册流程的主体 action为register的都进入这个index   然后根据step参数进入不同步骤页面
  components: {
    Loading,
    Step1,
    Step2,
    Step3
  },
  methods: {
    regInfo () { // 注册时 用户填写的信息 直接传入services.user.register(data)  提交至服务器
      return {
        phone: this.phone,
        password: this.password,
        nick: this.nick,
        gender: this.gender,
        schoolId: this.schoolId,
        academyId: this.academyId,
        schoolUn: this.schoolUn,
        schoolPw: this.schoolPw,
        enterYear: this.enterYear
      }
    },
    stepInfo (o) { // 把传入的 键值对 类型的值赋值给该组件的变量
      Object.keys(o).forEach(key => {
        this[key] = o[key]
      })
    },
    onReset () {
      console.log('reset')
      this.prompt = null
      this.sendBack = {}
      this.register()
    },
    register () { // 注册
      this.loading = true
      let data = this.regInfo()
      if (this.prompt) { // prompt废弃
        let moreData = this.schoolMore
        data.schoolMore = this.sendBack || {}
        Object.keys(moreData).forEach(i => data.schoolMore[i] = moreData[i])
      }
      let blob = dataURLtoBlob(this.$refs.step2.previewData)
      services.user.register(data) // 提交用户填写的注册信息
        .then(() => {
          return services.user.uploadAvatar(blob) // 上传头像
        })
        .then(() => {
          return services.user.login(data.phone, data.password) // 顺便登录
        })
        .then(() => {
          return services.xsq.updateInfo() // 信息往友盟传一次
        })
        .then(() => {
          return services.xsq.uploadAvatar(blob) // 头像往友盟传一次
        })
        .then(() => {
          this.loading = false
          return this.$router.go({ // 注册完毕 进入home主页面
            name: 'home'
          })
        })
        .catch(e => {
          this.loading = false
          if (e.code === 116) {
            let res = e.res
            this.prompt = res.prompt
            this.sendBack = res.sendback
          }
        })
    }
  },
  data () {
    return {
      phone: '',
      password: '',
      nick: '',
      gender: '',
      schoolId: 0,
      academyId: 0,
      schoolUn: '',
      schoolPw: '',
      enterYear: '',
      schoolMore: null,
      prompt: null,
      sendBack: {}
    }
  },
  computed: {
    step () { // step值决定显示哪个页面   默认step为1
      return this.$route.query.step || 1
    },
    switchStyle () { // 选择显示那个step
      return {
        transform: `translate3d(0,-${(this.step - 1) * 100}%,0)`
        // marginTop: `-${(this.step - 1) * 100}%`
      }
    }
  }
}
</script>

<style lang="less" scoped>
.register-frag {
  height: 100%;
  .page-switch {
    transition: all .5s ease;
    height: 100%;
  }
  .scroll-layout {
    background-color: #fff;
    overflow-y: auto;
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
    display: table;
    .form {
      display: table-cell;
      vertical-align: middle;
      padding-bottom: 30px;
    }
  }
}
</style>