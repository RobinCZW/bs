import 'babel-polyfill' // main.js 程序入口文件，加载各种公共组件
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import MintUI from 'mint-ui'
import VueAnimatedList from 'vue-animated-list'
import VueTouch from 'vue-touch'
import VueTransferDom from 'vue-transfer-dom'
import VueResize from './plugins/vue-resize'
import VueOnhold from './plugins/vue-onhold'
import VueCommonDefine from './plugins/vue-common-define'
import App from './App'

import Home from './pages/home'
import First from './pages/first'
import File from './pages/file'
import FileUpload from './pages/file-upload'

import UserIndex from './pages/user/index'
import UserModify from './pages/user/modify'
import UserComments from './pages/user/comments'
import UserLikeme from './pages/user/likeme'
import UserOrder from './pages/user/order'

import FeedIndex from './pages/feed/index'
import Feed from './pages/feed/feed'
import FeedDetail from './pages/feed/feed-detail'
import Browser from './pages/browser'
import DownloadDetail from './pages/download-detail'
import OrderForm from './pages/order/form'

import Test from './pages/test'

import services from './utils/services'
import MintFix from './utils/mint-fix'
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(MintUI)
Vue.use(VueAnimatedList)
Vue.use(VueTouch)
Vue.use(VueTransferDom)
Vue.use(VueResize)
Vue.use(VueOnhold)
Vue.use(VueCommonDefine(services))
MintFix(Vue)

import MyComponents from './components'
Vue.use(MyComponents)

window.Vue = Vue
window.services = services // TODO: remove it

const FastClick = require('fastclick')
FastClick.attach(document.body)

const router = new VueRouter({
  abstract: false,
  hashbang: false
})

router.afterEach(({ from, to }) => {
  // 统计
  if (window.MobclickAgent) {
    // window.MobclickAgent.onPageEnd()
    // window.MobclickAgent.onPageBegin()
    if (from.path) {
      window.MobclickAgent.onPageEnd(from.path)
    }
    if (to.path) {
      window.MobclickAgent.onPageBegin(to.path)
    }
  }
})

router.map({
  '/home': {
    name: 'home',
    component: Home
  },

  '/feed': {
    component: FeedIndex,
    subRoutes: {
      '/list/:tid/:name': {
        name: 'feed',
        component: Feed
      },
      '/detail': {
        name: 'feed.detail',
        component: FeedDetail
      }
    }
  },

  '/first': {
    name: 'first',
    component: First
  },
  '/file/:school/*path': {
    name: 'file',
    component: File
  },
  '/file/:school': {
    component: File
  },
  '/file': {
    component: File
  },
  '/file-upload': {
    name: 'file-upload',
    component: FileUpload
  },
  '/browser/:protocol/*url': {
    name: 'browser',
    component: Browser
  },
  '/user': {
    component: UserIndex,
    subRoutes: {
      '/modify': {
        name: 'user.modify',
        component: UserModify
      },
      '/comments': {
        name: 'user.comments',
        component: UserComments
      },
      '/likeme': {
        name: 'user.likeme',
        component: UserLikeme
      },
      '/order': {
        name: 'user.order',
        component: UserOrder
      }
    }
  },

  '/download/detail/:md5': {
    name: 'download.detail',
    component: DownloadDetail
  },
  '/order/form/:list': {
    name: 'order.form',
    component: OrderForm
  },
  '/test': {
    component: Test
  }
})
router.redirect({ // 应用刚启动时 重定向到该路径
  // '/': '/home',
  '/': '/first',
  '*': '/'
})

function detectStatusBar () {
  if (window.cordova || (('standalone' in window.navigator) && window.navigator.standalone)) {
    require(['assets/css/iosfullscreen.css'])
    services.config.statusBarHeight = 20
  } else {
    services.config.statusBarHeight = 0
  }
  require(['assets/css/iosfullscreen.css'])
  services.config.statusBarHeight = 20
}
function afterInit () {
  detectStatusBar()

  window.location.hash = '#'
  router.start(App, '#app') // 启动路由  仅仅是为了启动路由  实际跳转的路径已在上方重定向
}

function avoidDoubleBack () {
  var now = function () { return new Date().getTime() }
  var lastTime = now()
  var oldBack = window.history.back
  function onBack () {
    if (now() - lastTime < 100) {
      console.warn('ignore the quick second back')
      return
    }
    lastTime = now()
    oldBack.call(window.history)
  }
  window.history.back = onBack
}

function run () {
  let lastBack = 0
  const oldBack = window.history.back
  const now = () => new Date().getTime()
  const rootPath = ['/home', '/first']
  const onBack = () => {
    let path = router._currentRoute.path
    console.log(path, rootPath, now())
    if (rootPath.includes(path)) {
      if (now() - lastBack <= 500) {
        console.log('exit')
        navigator.app.exitApp()
      } else {
        lastBack = now()
        services.utils.toast('再按一次退出程序')
      }
      console.log('double click to exit')
    } else {
      oldBack.call(window.history)
    }
  }
  window.history.back = onBack
  if (window.cordova) {
    document.addEventListener('backbutton', onBack, false)
  }
  avoidDoubleBack()
  services.init().then(afterInit, afterInit)
}
function start () {
  if (window.hotfix) {
    window.hotfix(require, run)
  } else {
    run()
  }
}
module.exports = {
  start
}
