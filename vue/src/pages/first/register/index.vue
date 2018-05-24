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
      .scroll-layout
        .container
          .form
            step2(@info='stepInfo', @register='register', v-ref:step2)
      .scroll-layout
        .container
          .form
            step3(@info='stepInfo', @register='register', @reset='onReset', :prompt='prompt')
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
    regInfo () {
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
    stepInfo (o) {
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
      if (this.prompt) {
        let moreData = this.schoolMore
        data.schoolMore = this.sendBack || {}
        Object.keys(moreData).forEach(i => data.schoolMore[i] = moreData[i])
      }
      let blob = dataURLtoBlob(this.$refs.step2.previewData)
      services.user.register(data)
        .then(() => {
          return services.user.uploadAvatar(blob)
        })
        .then(() => {
          return services.user.login(data.phone, data.password)
        })
        .then(() => {
          return services.xsq.updateInfo()
        })
        .then(() => {
          return services.xsq.uploadAvatar(blob)
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
    step () { // 进入哪一步
      return this.$route.query.step || 1
    },
    switchStyle () {
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