<template lang="pug">
.user-order
  page-scroll(title='打印订单', :loading='$loadingRouteData', :watch-data='watchData', :top-method='refreshData', :bottom-method='loadmore')
    back-btn(slot='left')
    .box(v-for='i in items')
      good-item(:name='i.title', :image='i.image')
        span(slot='middle') 下单时间: {{ convertTime(i.createTime) }}
        span(:style='stateStyle(i.state)') {{ convertState(i.state) }}
        span.price(v-if='i.state == "Paying"') ￥{{(i.totalPrice / 100).toFixed(2)}}
        x-button.pay(v-if='i.state == "Paying"', type='default', :mini='true', :plain='true', @click='pay(i.uuid)') 立即支付
      .sep
</template>

<script>
import CommentList from './comment-list'
import XButton from 'vux-components/x-button'
import services from 'utils/services'

export default { // 发现页 打印订单 查看订单状态
  components: {
    CommentList,
    XButton
  },
  data () {
    return {
      list: [],
      page: 1,
      loading: false
    }
  },
  ready () {
    return this.refreshData()
  },
  route: {
    activate (transition) {
      this.refreshData()
      transition.next()
    }
  },
  methods: {
    pay (uuid) {
      return services.order.pay(uuid).then(() => this.refreshData())
    },
    stateStyle (state) {
      const color = {
        'Success': '#000',
        'Paying': 'red',
        'Shipping': '#ffa149',
        'Closed': 'black'
      }[state]
      return {
        color
      }
    },
    convertTime (timestamp) {
      let d = new Date(timestamp)
      let h = d.getHours().toString()
      let min = d.getMinutes().toString()
      h = h.length === 1 ? '0' + h : h
      min = min.length === 1 ? '0' + min : min
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${h}:${min}`
    },
    convertState (state) {
      return {
        'Success': '已送达',
        'Paying': '待付款',
        'Shipping': '等待配送',
        'Closed': '已关闭'
      }[state]
    },
    refreshData () {
      this.page = 1
      return services.order.list(this.page)
        .then(r => {
          console.log(r)
          this.list = r.items
        })
    },
    loadmore () {
      if (this.loading) return
      this.loading = true
      this.page += 1
      return services.order.list(this.page)
        .then(r => {
          this.list.push(...r.items)
          this.loading = false
        })
    }
  },
  computed: {
    watchData () {
      return this.list
    },
    items () {
      return this.list.map(item => {
        if (item.list.length === 0) return null
        item.title = item.list[0].title
        item.image = item.list[0].image
        return item
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-order {
  .sep {
    display: block;
    height: 1px;
    background-color: #bbb;
  }
  .pay {
    float: right;
    color: white;
    background-color: #508CEE;
    border-color: #508CEE;
  }
  .price {
    color: red;
  }
}
</style>
