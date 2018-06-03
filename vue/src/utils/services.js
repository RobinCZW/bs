import manifest from '../manifest'
import Vue from 'vue'
import VueResource from 'vue-resource'
import xsq from './xsq'
import DownloadManager from 'utils/download' // 下载操作的函数在 download.js里 这里直接引用
import { Toast, MessageBox } from 'mint-ui'
import {alipay} from './pay'

Vue.use(VueResource)

function https (url) { //http换成https
  if (url.startsWith('http://')) {
    return `https://${url.substr(7)}`
  }
  return url
}

const urlRoot = 'http://finalexam.cn'// 'http://finalexam.cn' // 'http://192.168.31.169:8080'  域名urlroot
const urlRootHttps = https(urlRoot)
const apiAdmin = urlRoot + '/api/admin'; // 管理员的api
const apiRoot = urlRoot + '/api'; // api前缀

var sessionId = localStorage.getItem('sessionId') // 从localstorage里获取sessionid
const customError = {
  '/user/modify': (response) => {
    if (response.status === 104) { // 参数错误
      const map = {
        nickname: '昵称已被占用',
        gender: '性别',
        AcademyId: '学院选择错误',
        password: '密码不符合规则',
        enterYear: '入学年份无效'
      }
      let text = ''
      for (let field of response.body.fields) {
        if (map[field]) {
          text += map[field] + ' '
        }
      }
      text += ', 请修改后重新提交'
      response.statusText = text
    }
  }
}
Vue.http.interceptors.push((request, next) => {
  // use session
  if (request.url.startsWith(urlRoot) || request.url.startsWith(urlRootHttps)) {
    if (sessionId !== null) {
      request.params['sessionId'] = sessionId
    }
    next(response => {
      let r = response.body
      if (response.status === 200) { // 访问api成功
        response.body = r.res
        response.status = r.code
        response.statusText = r.info
        response.ok = r.code === 0
        if (!response.ok) {
          for (let patn of Object.keys(customError)) {
            if (request.url.indexOf(patn) !== -1) {
              customError[patn](response)
              break
            }
          }
        }
      } else { // 访问api失败
        response.body = `${response.status} ${response.statusText}`
        response.status = -1
        response.statusText = '网络错误'
        response.ok = false
      }
    })
    return
  }
  next()
})

var services = new Vue({
  methods: {
    prepare () {
      let ret = Promise.resolve()
      // if (this.first) { // sessionId === null
      //   ret = ret.then(() => this.$http.post(apiRoot+'/session'))
      //     .then(apiRC, apiRC)
      //     .then(r => {
      //       sessionId = r.sessionId
      //       localStorage.setItem('sessionId', sessionId)
      //       this.first = false
      //     })
      // }
      return ret
    },
    wrapper (method) {
      let self = this
      return function () {
        return self.prepare()
          .then(() => method.apply(self, arguments))
          .then(apiRC, apiRC)
      }
    },
    initSession () { // 获得session
      return this.$http.post(apiRoot+'/session')
        .then(apiRC, apiRC)
        .then(r => {
          console.log(r)
          sessionId = r.sessionId
          localStorage.setItem('sessionId', sessionId) // session存在本地了
        })
    },
    initModules () {
      let all = []
      let dict = {}
      let initer = (group) => {
        let inited = false
        return Promise.resolve().then(() => {
          let chain = Promise.resolve()
          if (inited) return chain
          if (group.deps) {
            for (let d of group.deps) {
              chain = chain.then(() => dict[d])
            }
            chain = chain.then(() => {
              let deps = {}
              for (let d of group.deps) {
                deps[d] = this.$data[d]
              }
              return deps
            })
          }
          chain = chain.then(deps => {
            deps = deps || {}
            if (!inited) {
              return group.init.call(group, deps, this.store)
            }
          }).then(() => inited = true)
          return chain
        })
      }
      // 启动每个模块的init
      Object.keys(this.$data).forEach(key => {
        let group = this.$data[key]
        if (typeof group === 'object') {
          if (Object.keys(group).includes('init')) {
            dict[key] = initer(group)
          } else {
            dict[key] = () => null
          }
          all.push(dict[key])
        }
      })
      console.group('services')
      console.log('services init begin')
      return Promise.all(all).then(() => {
        console.log('services init done')
        console.groupEnd()
      })
      .catch(e => {
        console.log('services init err', e)
        console.groupEnd()
      })
    },
    init () {
      return this.initSession()
        .then(() => this.initModules())
    }
  },
  created () {
    try {
      let json = JSON.parse(localStorage.getItem('store'))
      for (let key of Object.keys(json)) {
        this.store[key] = json[key]
      }
    } catch (e) {}

    Object.keys(this.$data).forEach(key => {
      if (['utils'].includes(key)) return
      let group = this.$data[key]
      if (typeof group === 'object') {
        Object.keys(group).forEach(method => {
          if (!(['init'].includes(method)) && (typeof group[method] === 'function')) {
            group[method] = this.wrapper(group[method])
          }
        })
      }
    })
    //
    this.xsq = xsq.call(this, Vue.http, this.$http)
    this.download = DownloadManager
    // 启动更新now的interval
    setInterval(() => {
      this.utils.now = new Date()
    }, 1000)
  },
  watch: {
    store: { // store发生变化的时候,序列化成字符串存入json
      handler () {
        localStorage.setItem('store', JSON.stringify(this.store))
      },
      deep: true
    }
  },
  computed: {
    manifest () {
      return manifest
    }
  },
  data: {
    first: true, // 启动时第一次判断
    config: {
      disableRipple: true,
      statusBarHeight: 0
    },
    store: { // 不使用子对象   store里面存   用户名 密码 user{} 收藏课程list[] 打印个人宿舍信息 
      username: '',
      password: '',
      user: {},
      topList: [],
      orderform: {
        name: '',
        addr: '',
        phone: ''
      }
    },
    global: { // TODO: ugly         全局变量  当前feed
      curFeed: {}
    },
    xsq: {},
    download: {},
    utils: {
      delay (i) {
        return function () {
          return new Promise((res, rej) => setTimeout(() => res.apply(null, arguments), i));
        }
      },
      toast (message, duration = 3000) {
        Toast({
          message: message,
          position: 'middle',
          duration: duration
        });
      },
      prompt (message) {
        return MessageBox.prompt(message)
      },
      MessageBox: MessageBox,
      now: new Date()
    },
    review: {
      list () {
        return this.$http.post(apiAdmin+'/review/list')
      }
    },
    sms: { // 短信sdk 阿里通信
      send (phone = null) {
        return this.$http.post(apiRoot+`/sms/send`, {phone})
      },
      trusted () {
        return this.$http.post(apiRoot+`/sms/trusted`)
      },
      verify (code) {
        return this.$http.post(apiRoot+`/sms/verify`, {code})
      }
    },
    dbfs: {
      getDownloadUrl (school, path) { // 获取文件真实的oss下载链接
        // return apiRoot+`/dbfs/${school}/download?path=`+encodeURI(path);
        return this.$http.post(apiRoot+`/dbfs/${school}/downloadurl`, {path: path})
      },
      hashExist (school, hash) { // 查询指定的MD5在服务器是否存在. res直接为true或false
        return this.$http.post(apiRoot+`/dbfs/${school}/hashExist`, {hash: hash})
      },
      list (school, path, detail = '0') { // 返回学校文件系统路径下的所有文件夹和文件列表 0为不详细  1为详细
        return this.$http.post(apiRoot+`/dbfs/${school}/list`, {path: path, detail: detail})
      },
      addFolder(school, path) {  // 添加文件夹(新课程)
        return this.$http.post(apiRoot+`/dbfs/${school}/newFolder`, {path: path})
      },
      link (school, path, hash) { // 在hashExist为true时使用(服务器有该文件), 将path处的文件内容设置为md5为hash的文件.
        return this.$http.post(apiRoot+`/dbfs/${school}/link`, {path: path, hash: hash})
      },
      upload (school, data, pcb) { // 上传文件并放到path指定的位置. 发送类型为multipart
        return ajaxFile(apiRoot+`/dbfs/${school}/upload`, data, pcb)
          //.then(r => console.log(r));
      }
    },
    user: {
      init ({}, store) {
        // console.log('user.init', this, store)
        if (store.username.length > 0) {
          return this.login(store.username, store.password)
            .then(r => {
              console.log('user done')
              return r
            }).catch(e => {
              console.error('user err', e)
            })
        } else {
          return this.info()
            .then(r => {
              if (r.CollegeId === null || r.AcademyId === null || r.enterYear === null) {
                throw new Error('信息未补全')
              } else {
                this.store.isLogin = true
                store.user = r
              }
            }).catch(e => {
              console.error('user err', e)
            })
        }
      },
      store: {
        isLogin: false
      },
      resetpw (username, password) { // 重置密码
        return this.$http.post(apiRoot+'/user/resetpw', {
          username,
          password
        })
      },
      modify (data) { // 修改用户信息
        return this.$http.post(apiRoot+'/user/modify', data)
      },
      infoByName (nickname) {
        return this.$http.post(apiRoot+'/user/infobyname', {nickname: nickname})
      },
      xsqToken () {
        return this.$http.post(apiRoot+'/user/xsqToken')
      },
      oauthLogin (platform, openId, accessToken) { // qq快捷登录
        return this.$http.post(https(apiRoot+'/user/oauthLogin'), {
          platform,
          openId,
          accessToken
        }).then(r => {
          r.data.avatar = `${urlRoot}/${r.data.avatar}`
          this.store.user = r.data
          this.user.store.isLogin = true
          return r
        })
      },
      login (un, pw) { // 账号密码登录   同时将用户信息写入 store 存储在本地
        return this.$http.post(https(apiRoot+'/user/login'), {un: un, pw: pw})
          .then((r) => {
            r.data.avatar = `${urlRoot}/${r.data.avatar}`
            this.store.username = un
            this.store.password = pw
            this.store.user = r.data
            this.user.store.isLogin = true
            return r
          })
      },
      info () { // 返回用户信息, 若未登录则返回错误NotLogin
        return this.$http.post(apiRoot+'/user/info')
          .then(r => {
            r.data.avatar = `${urlRoot}/${r.data.avatar}`
            this.store.user = r.data
            return r
          })
      },
      logout () {
        return this.$http.post(apiRoot+'/user/logout')
          .then(r => {
            this.store.username = ''
            this.store.password = ''
            this.store.user = {}
            this.user.store.isLogin = false
            return r
          })
      },
      sendCode (phone) { // 请求发送验证码  现在短信接口不可用
        return this.$http.post(apiRoot+'/user/sendcode', {phone: phone})
      },
      checkCode (code) { // 验证用户输入的验证码是否正确
        return this.$http.post(apiRoot+'/user/verifycode', {code: code})
      },
      register (data) { // 提交信息用户注册时填写的信息data给服务器端  进行注册
        return this.$http.post(https(apiRoot+'/user/register'), data)
      },
      uploadAvatar (avatar) { // 上传头像 文件po上去 服务器端根据session里用户信息自动处理绑定关系
        let formData = new FormData()
        formData.append('avatar', avatar)
        return this.$http.post(apiRoot+'/user/upload', formData)
          .then(r => {
            r.data.avatar = `${urlRoot}/${r.data.avatar}`
            return r
          })
      }
    },
    ad: {
      store: {},
      init () {
        return this.list()
          .then(r => {
            console.log('ad: ', r)
            if (r.androidVer > manifest.version) { // 检测版本号
              MessageBox.confirm('有新版本更新了, 是否下载?', '更新提示')
                .then(() => {
                  console.log('download new version')
                  window.open(r.androidUrl, '_system')
                })
                .catch(() => null)
            }
            if (r.pic) { // 如果有广告图片 则把广告图的url存起来(加上头)
              if (!/^https?:\/\//.test(r.pic)) {
                r.pic = `${urlRoot}/${r.pic}`
              }
            }
            this.store = r
          })
      },
      list () { // 给广告用的 用sb 代替 ad  防止拦截
        return this.$http.post(apiRoot+'/sb/getsb')
      }
    },
    school: {
      init () {
        return this.list()
      },
      store: {
        schoolList: []
      },
      list () { // 获取学校列表
        return this.$http.post(apiRoot+'/school/list')
          .then(putData(r => {
            this.school.store.schoolList = r
          }))
      },
      listCourse (college) { // 获取课程列表  废弃  直接通过学校id获取文件路径下的文件列表了
        return this.$http.post(apiRoot+'/school/listCourse', {college: college})
      },
      listAcademy (college) { // 获取学院列表
        return this.$http.post(apiRoot+'/school/listAcademy', {college: college})
      }
    },
    good: { // 商品列表
      store: { // 每个store不同  用户信息的是 localstore.user.store       商品的是localstore.good.store
        list: []
      },
      list () {
        return this.$http.post(apiRoot+'/good/list')
          .then(putData(r => {
            this.good.store.list = r
          }))
      },
      list2 () { // list2和上门list区别是  list2的response带商品list以及 营业状态closed
        return this.$http.post(apiRoot+'/good/list2')
          .then(putData(r => {
            this.good.store.list = r.list
          }))
      }
    },
    order: { // 订单相关
      add (data) { // 下单 后台增加一个订单信息   data里是  addr地址   name姓名  phone电话  list二维数组[[1,2],[3,4]]表示商品ID为1的是2份,商品ID为3的是4份
        return this.$http.post(apiRoot+'/order/add', data)
      },
      pay (uuid, type = 'alipay') { // 默认只有alipay
        let response
        return this.$http.post(apiRoot+'/order/pay', {uuid, type})
          .then(r => {
            // r: {body: { type: alipay, payinfo: "1234" }}
            response = r
            const body = r.body
            switch (body.type) { // 服务器端返回成功添加订单后才调用alipay接口(pay.js)
              case 'alipay':
                return alipay(body.payinfo)
            }
            throw '支付方式错误'
          })
          .then(() => {
            return response
          })
          .catch(e => {
            services.utils.toast(e)
          })
      },
      list (page = 1) { // 获取订单列表 后台根据用户session  自动返回该用户的订单列表
        return this.$http.post(apiRoot+'/order/list', { page })
      }
    }
  }
});

function putData(fn) {
  return function pd(r) {
    try {
      fn(r.body)
    } catch (e) {}
    return r
  }
}

// function apiRC(r) {
//   //make return code to error(reject)
//   r = r.data;
//   if (r.code !== 0) {
//     var err = new Error(r.info);
//     err.code = r.code;
//     err.res = r.res;
//     throw err;
//   } else {
//     return r.res;
//   }
// }

function apiRC(r) {
  if (r.status === 0) {
    return r.data
  } else {
    var err = new Error(r.statusText);
    err.code = r.status;
    err.res = r.data;
    services.utils.toast(r.statusText)
    throw err;
  }
}

export default services;

function ajaxFile(url, data, pcb) {
  pcb = pcb || (() => 0);
  var formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return $.ajax({
    url: url,
    type: "POST",
    data: formData,
    xhr: () => {
      var myXhr = $.ajaxSettings.xhr();
      if(myXhr.upload){
        myXhr.upload.addEventListener('progress', (e) => pcb(e.loaded, e.total), false);
      }
      return myXhr;
    },
    contentType: false,
    processData: false
  }).then(r => ({
    data: r
  }));

}
