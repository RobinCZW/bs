<template lang="pug">
.home-root
  mt-tab-container(:active.sync='active', :swipeable='true')
    //- active是当前激活的tab名   swipeable是切换效果
    mt-tab-container-item.tabc-item(v-for='tab in tabs', :id='tab.id') 
      component(:is='tab.id', @changetab='onChangeTab', :attaching='attaching')
      //- 子组件(就是五个主页面组件)  通过id判断   attaching废弃(原处理课程列表记忆问题)
  mt-tabbar(:selected.sync='active', transition2='tabbar', v-show='tabShow')
    mt-tab-item(v-for='tab in tabs', :id='tab.id')
      //- mt-tab-item自带icon的slot
      img(slot='icon',:src='dynIcon(tab)')
      | {{ tab.name }}
</template>

<script>
// import Tabbar from 'vux-components/tabbar/tabbar'
// import TabbarItem from 'vux-components/tabbar/tabbar-item'
import Course from './course'
import Download from './download'
import Community from './community'
import User from './user'
import Print from './print'

function iconPair (name) { // 更新tab图标
  return [
    require(`assets/icon/tabbar/${name}1.png`), // tab栏已选中图标 2是未选中图标
    require(`assets/icon/tabbar/${name}2.png`)
  ]
}
export default {
  methods: {
    dynIcon (tab) {
      return tab.icon[this.active === tab.id ? 1 : 0]
    },
    onChangeTab (val) {
      this.tabShow = val
    }
  },
  ready () {
  },
  attached () {
    this.attaching = true
  },
  detached () {
    this.attaching = false
  },
  data () {
    return {
      attaching: false,
      active: 'course', // 进入主页面停留在哪个tab   mt-tabbar(:selected.sync= mt-tab-container(:active.sync mint容器内设置哪个就行 相应的active替代component组件 进行某个子组件.vue渲染
      tabShow: true, // tab栏是否显示  搜索时是隐藏的
      tabs: [{
        id: 'print',
        name: '打印', // tab名
        icon: iconPair('5') // 获取图标路径
      }, {
        id: 'course',
        name: '资料',
        icon: iconPair('1')
      }, {
        id: 'download',
        name: '已下载',
        icon: iconPair('2')
      }, {
        id: 'community',
        name: '学生圈',
        icon: iconPair('3')
      }, {
        id: 'user',
        name: '发现',
        icon: iconPair('4')
      }]
    }
  },
  components: {
    Course,
    Download,
    Community,
    User,
    Print
  },
  computed: {
    contentHeight () { // 内容高度 有tab栏则减55像素
      return this.parentHeight - (this.tabShow ? 55 : 0)
    }
  },
  watch: {
    active () {
      //
    }
  }
}
</script>

<style lang="less">
.home-root {
  height: 100%;
  bottom: 0;
  .mint-tabbar > .mint-tab-item.is-selected {
    background-color: #fafafa !important; // !important让该组件内部所有color都等于该值
  }
  .tabc-item {
    width: 100%;
  }
}

.page-transition { // 以下都是 mint-ui 自带  动画效果
  transition: all .3s ease;
  /*transition: all .3s ease;*/
}
.page-enter {
  /*transform: translateY(100vh);*/
  opacity: 0;
}
.page-leave {
  /*transform: translateX(100vw);*/
  transition-delay: .3s;
  opacity: 0;
}

.tabbar-transition {
  transition: all .1s ease;
}
.tabbar-enter , .tabbar-leave {
  transform: translateY(100%);
}

.weui_tabbar_item.weui_bar_item_on .weui_tabbar_label {
  color: #0092ff !important;
}
</style>