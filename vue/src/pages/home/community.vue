<template lang="pug">
.community-page(v-on-resize)
  page-scroll(title='学生圈', :loading='initLoading', :watch-data='comms', :top-method='refreshData', :bottom-method='loadmore')
    .container
      mt-swipe.swiper(:prevent='true', :style='swiperStyle')
        mt-swipe-item(v-for='item in list')
          .img(:style='{backgroundImage: "url("+item.img+")"}')
      div(v-for='item in comms', @click='enter(item)')
        icon-item(:name='item.name', :icon='item.icon', :lb='item.desc', v-link='feedLink(item)')
      loadmore-btn(v-if='next', @click='loadmore')
      .more(v-if='!next') 更多频道, 尽情期待...
</template>

<script>
import Swiper from 'vux-components/swiper'
import services from 'utils/services'
import Group from 'vux-components/group'
services // window.MultiImagePicker.getPictures(null,null,{maxNum:9,style:{themeColor:'#508CEE'}})

// const test = require('assets/test.png')
let imgs = ['0.png', '1.png', '2.png', '3.jpg', '4.png', '5.png'].map(i => require(`assets/comm/${i}`)) // 轮播图的图片

export default { // 学生圈页面
  components: {
    Swiper,
    Group
  },
  methods: {
    test () {
      console.log(this.list[this.listIndex])
    },
    enter (item) {
      console.log('enter', item)
    },
    feedLink (item) { // 点击item后 跳转到 feed.vue 页面 并且参数是 频道(item)的id和name  (具名路由)
      return {
        name: 'feed',
        params: {
          tid: item.id,
          name: item.name
        }
      }
    },
    refreshData () {
      return services.xsq.listTopic() // 频道(话题) 列表
        .then(r => {
          this.next = r.next
          this.initLoading = false
        })
    },
    loadmore () {
      // console.log('loadmore')
      if (this.next) {
        return services.xsq.listTopic(this.next)
          .then(r => {
            this.next = r.next
          })
      }
    }
  },
  computed: {
    comms () {
      return services.xsq.store.topicList
    },
    swiperStyle () {
      return {
        height: `${this.windowWidth / 1.6}px`
      }
    }
  },
  ready () {
    this.refreshData()
  },
  data () {
    return {
      initLoading: true,
      listIndex: 0,
      next: null,
      list: imgs.map(i => ({ // 轮播图图片list
        img: i
      })),
      windowWidth: window.innerWidth
    }
  },
  events: {
    resize (w, h) {
      this.windowWidth = w
    }
  }
}
// 'http://7xqzw4.com2.z0.glb.qiniucdn.com/3.jpg'
</script>

<style lang="less" scoped>
.community-page {
  .container {
    padding-bottom: 15px;
    .more {
      padding-top: 5px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .swiper {
      height: auto; // set in style
      .img {
        height: 100%;
        width: 100%;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>