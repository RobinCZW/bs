<<template lang="pug">
  .ad-view
    .pic(:style='{backgroundImage: "url(\\""+pic+"\\")"}')
    .skip(@click='skip') 跳过 {{remain}}
</template>

<script>
import services from 'utils/services'
export default {
  computed: { // computed里面的方法会实时根据值的变化而重新执行和刷新结果  例如此处的图片可以变化
    pic () {
      return services.ad.store.pic
    }
  },
  methods: {
    skip () { // 跳过广告
      if (this.minusId) {
        clearTimeout(this.minusId)
      }
      this.$emit('done') // 触发给父组件的自定义事件 父组件是App.vue  里面赋值给AdView  该页面结束了 进入router下一个页面
    },
    minus () { // 广告倒计时
      this.remain--
      if (this.remain > 0) {
        setTimeout(() => this.minus(), 1000) // 1000毫秒沉睡一次
      } else { // 0
        this.$emit('done')
      }
    }
  },
  ready () { // 自动触发的函数
    setTimeout(() => this.minus(), 1000)
  },
  data () {
    return {
      remain: 3,
      minusId: null
    }
  }
}
</script>

<style lang="less">
.ad-view {
  position: fixed;
  left: 0;
  right:0;
  top: 0;
  bottom: 0;
  .pic {
    width: 100%;
    height: 100%;
    background-size: cover; // cover最大化背景
    background-repeat: no-repeat;
    background-position: center;
  }
  .skip {
    position: absolute;
    right: 5%;
    top: 8%;
    border-radius: 10px; // 圆角半径
    background-color: rgba(0, 0, 0, 0.5);
    width: 60px;
    height: 30px;
    padding: 3px;
    text-align: center; // 文本居中
    box-sizing: border-box; // 盒子模型的盒子大小 border-box 表示 width和height就是盒子的大小  自动去除padding后才是内容的宽高
    color: white;
    font-size: 14px;
  }
}
</style>
