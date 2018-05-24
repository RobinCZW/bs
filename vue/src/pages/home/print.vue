<template lang="pug">
.print-page
  page-scroll(title='在线打印', :loading='initLoading', :watch-data='items', :top-method='refreshData')
    .banner
      .roller(:style='rollerStyle', v-el:roller)
        span(v-if='!closed')
          | 如需打印自定义资料, 请用电脑访问 finalexam.cn
        span(v-if='closed') 暂停营业
    .sep
    div(v-for="item in items")
      good-item(:price='item.price/100', :image='item.image', :name='item.title')
        x-button.buy(:class='buyClass', type='default', :mini='true', :plain='true', @click='buy(item)') 立即打印
      .sep
</template>



<script>
import services from 'utils/services'
import XButton from 'vux-components/x-button'

export default {
  components: {
    XButton
  },
  computed: {
    items () {
      return services.good.store.list
    },
    buyClass () {
      return {'buy-disable': this.closed}
    }
  },
  data () {
    return {
      initLoading: true,
      rollid: null,
      rollerStyle: {
        left: '0'
      },
      closed: false // closed为true时暂停营业
    }
  },
  beforeDestroy () {
    if (this.rollid) {
      clearInterval(this.rollid)
    }
  },
  ready () {
    this.rollid = setInterval(() => this.onTimer(), 5000)
    return this.refreshData() // 页面加载完成后刷新商品页数据
  },
  methods: {
    refreshData () { // 刷新商品页信息
      return services.good.list2().then(r => {
        this.initLoading = false
        // this.closed = r.closed // r.closed是服务器返回的是否营业的变量
      })
    },
    buy (item) {
      if (this.closed) return
      this.$router.go({
        name: 'order.form',
        params: {
          list: JSON.stringify([[item.id, 1]])
        }
      })
    },
    onTimer () {
      let textRect = this.$els.roller.getBoundingClientRect()
      let textWidth = textRect.right - textRect.left
      let windowWidth = document.documentElement.clientWidth
      if (textWidth <= windowWidth) {
        this.rollerStyle.left = ''
      } else {
        if (textRect.left === 0) {
          this.rollerStyle.left = `${windowWidth - textWidth}px`
        } else {
          this.rollerStyle.left = '0'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.print-page {
  .sep {
    display: block;
    height: 1px;
    background-color: #bbb;
  }
  .banner {
    padding: 5px 0;
    text-align: center;
    .roller {
      &:before , &:after {
        content: " ";
        display: inline-block;
        width: 10px;
      }
      position: relative;
      display: inline-block;
      white-space: nowrap;
      transition: all 3s linear;
    }
  }
  .buy {
    width: 100%;
    height: 100%;
    color: white;
    background-color: #508CEE;
    border-color: #508CEE;
  }
  .buy:active {
    background-color: darken(#508CEE, 5%);
    color: white;
  }
  .buy-disable {
    background-color: #bbb;
    border-color: #bbb;
  }
  .buy-disable:active {
    background-color: #bbb;
  }
}
</style>
