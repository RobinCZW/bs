<template lang="pug">
.feed-item(@click='emit("detail")')
  div(v-if='fullscreen')
    .fullscreen(v-transfer-dom)
      .wrap
        touch-picture.full(:src='fullImages[fullIndex]', @click='onCloseView')
        .toolbar
          // mt-button.close(@click='onCloseView') 关闭
          mt-button.left(v-show='hasLeft', @click='fullIndex--') 上一张
          mt-button.right(v-show='hasRight', @click='fullIndex++') 下一张
  sender-bar(
    :time='data.create_time | friendlyTime',
    :creator='data.creator',
    :anonymous='anonymous'
  )
    slot(slot='right', name='right')
  .content
    .text(v-text='data.content')
    div(v-if='data.imgs.length > 0', :class='picClass')
      pic-preview(:src='img[360]', v-for='img in data.imgs', @click.stop='onView($index)')
  div(:class='actionClass')
    .btn.like(v-on-hold='onHold', :class='likeClass', @click.stop='like')
      .number(v-text='zeroHide(data.likeCount)')
    .btn.fav(v-on-hold='onHold', :class='favClass', @click.stop='fav')
    .btn.comment(v-on-hold='onHold', @click.stop='emit("comment")')
      .number(v-text='zeroHide(data.commentCount)')
</template>

<script>
/*eslint eqeqeq: "off"*/
import SenderBar from 'components/sender-bar'
import PicPreview from 'components/pic-preview'
import TouchPicture from 'components/touch-picture'
import services from 'utils/services'

export default { // 是详情页里面的 上半部feed内容  不含评论区和键盘区   只是帖子内容和赞和收藏的区域
  name: 'feed-item',
  components: {
    PicPreview,
    TouchPicture,
    SenderBar
  },
  data () {
    return {
      // fullscreen: false,
      fullIndex: 0
    }
  },
  props: {
    // 123
    data: {
      required: true
    },
    bar: {
      default: true
    }
  },
  methods: {
    onCloseView () {
      console.log('close view')
      // this.fullscreen = false
      window.history.back()
    },
    onView (index) {
      // this.$emit('view', img)
      console.log('view ', index)
      this.fullIndex = index
      // this.fullSrc = img['750']
      // this.fullscreen = true
      let query = this.$route.query
      query.touchpicture = this.data.id
      this.$router.go({
        query: query
      })
    },
    onHold (e, start) {
      // let classes = e.currentTarget.className.split(' ')
      // if (start) {
      //   // pressed
      //   classes.push('pressed')
      // } else {
      //   classes = classes.filter(i => i !== 'pressed')
      // }
      // e.currentTarget.className = classes.join(' ')
      // e.currentTarget.style.backgroundColor = start ? '#f2f2f2' : ''
      if (start) {
        e.currentTarget.setAttribute('pressed', '')
      } else {
        e.currentTarget.removeAttribute('pressed')
      }
    },
    zeroHide (v) {
      if (v == 0) {
        return ''
      }
      return v
    },
    emit (eventName) {
      this.$emit(eventName)
    },
    fav () {
      if (this.doing) return
      this.data.collected = !this.data.collected
      this.doing = true
      let afterDone = () => {
        this.doing = false
      }
      let onFail = () => {
        this.doing = false
      }
      if (!this.data.collected) {
        return services.xsq.unfavFeed(this.data.id).then(afterDone, onFail)
      } else {
        return services.xsq.favFeed(this.data.id).then(afterDone, onFail)
      }
    },
    like () {
      if (this.doing) return
      this.data.liked = !this.data.liked
      this.data.likeCount += this.data.liked ? 1 : -1
      this.doing = true
      let afterDone = () => {
        this.doing = false
      }
      let onFail = () => {
        this.doing = false
      }
      if (!this.data.liked) {
        return services.xsq.unlikeFeed(this.data.id).then(afterDone, onFail)
      } else {
        return services.xsq.likeFeed(this.data.id).then(afterDone, onFail)
      }
    }
  },
  computed: {
    fullImages () {
      return this.data.imgs.map(i => i['750'])
    },
    hasLeft () {
      let len = this.fullImages.length
      return (len > 1) && (this.fullIndex > 0)
    },
    hasRight () {
      let len = this.fullImages.length
      return (len > 1) && (this.fullIndex + 1 < len)
    },
    actionClass () {
      return {
        'action-bar': this.bar,
        'action-group': !this.bar
      }
    },
    likeClass () {
      return {
        liked: this.data.liked
      }
    },
    favClass () {
      return {
        faved: this.data.collected
      }
    },
    anonymous () {
      return this.data.ext.a == 1
    },
    picClass () {
      let len = this.data.imgs.length
      let ret = ['pic']
      const colTable = [null, 1, 2, 3, 2, 3, 3, 3, 3, 3]
      const classTable = [null, 'pic-c1', 'pic-c2', 'pic-c3']
      if (len > 0) {
        ret.push(classTable[colTable[len]])
      }
      return ret
    },
    fullscreen () {
      return this.$route.query.touchpicture === this.data.id
    }
  }
}
</script>

<style lang="less" scoped>
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  background-color: black;
  // padding-bottom: 40px;
  box-sizing: border-box;
  .wrap {
    width: 100%;
    height: 100%;
    position: relative;
    .full {
      width: 100%;
      height: 100%;
    }
    .toolbar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background-color: rgba(255,255,255,0);
      display: flex;
      justify-content: space-around;
      // opacity: 0.5;
      .close {
        width: 100%;
      }
      .left , .right {
        // pointer-events: ;
        background-color: rgba(0,0,0,0);
        color: #fff;
        width: 30%;
        height: 36px;
      }
    }
  }
}
.feed-item {
  .clear {
    clear: both;
  }
  // box-shadow: 0 0 4px rgba(0,0,0,.1);
  background-color: #fff;
  margin-top: 15px;
  .action-group {
    position: relative;
    height: 90px;
    padding-top: 25px;
    padding-left: 20%;
    padding-right: 20%;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-around;

    // &:before {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   content: " ";
    //   display: block;
    //   height: 15px;
    //   width: 100%;
    //   background-color: rgb(251, 249, 254);
    // }
    
    .like {
      background-image: url("~assets/icon/xsq/detail_like1.png");
      &[pressed] {
        background-image: url("~assets/icon/xsq/detail_like2.png");
      }
      &:after {
        content: "喜欢";
      }
    }
    .liked:after {
      content: "已喜欢";
    }
    .fav {
      background-image: url("~assets/icon/xsq/detail_fav1.png");
      &[pressed] {
        background-image: url("~assets/icon/xsq/detail_fav2.png");
      }
      &:after {
        content: "收藏";
      }
    }
    .faved:after {
      content: "已收藏";
    }
    .btn {
      display: inline-block;
      width: 50px;
      height: auto;
      background-repeat: no-repeat;
      background-position: top center;
      background-size: 45px;
      padding-top: 50px;
      text-align: center;
      font-size: 14px;
    }
    .number {
      display: inline;
    }
    .comment {
      display: none;
    }
  }
  .action-bar {
    border-top: 1px solid #f2f2f2;
    height: 34px;
    .like {
      background-image: url("~assets/icon/xsq/like1.png");
    }
    .liked {
      background-image: url("~assets/icon/xsq/like2.png");
    }
    .fav {
      background-image: url("~assets/icon/xsq/fav1.png");
    }
    .faved {
      background-image: url("~assets/icon/xsq/fav2.png");
    }
    .comment {
      background-image: url("~assets/icon/xsq/comment.png");
    }
    .btn {
      display: inline-block;
      float: left;
      width: 33.3333%;
      height: 100%;

      background-repeat: no-repeat;
      background-position: center center;
      background-size: 16px;

      &[pressed] {
        background-color: #f2f2f2;
      }

      .number {
        margin-left: calc(50%+9px);
        margin-top: 6px;
        font-size: 14px;
        float: left;
        color: #aaa;
      }
    }
    .btn:after { // 分割线
      content: ' ';
      margin-right: -1px;
      background-color: #f2f2f2;
      margin-top: 6px;
      height: 22px;
      width: 1px;
      display: inline-block;
      float: right;
    }
  }
  .content {
    padding: 0 10px;
    .text {
      font-size: 17px;
      margin-bottom: 5px;
    }
    .pic > div {
      width: 30%;
      margin-right: 3%;
    }
  }
}
</style>