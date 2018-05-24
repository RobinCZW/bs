<template lang="pug">
.form-page
  page-scroll.stack(title='订单信息')
    div(slot='left')
      back-btn
    div(v-for="item in items")
      good-item(:price='item.good.price/100', :image='item.good.image', :name='item.good.title')
    group
      // x-input(title='收货人', :value.sync='name', placeholder='收货人')
      x-input(title='楼号宿舍床位', :value.sync='addr', placeholder='如 1号楼405 D床')
      x-input(title='联系电话', keyboard='number', placeholder='联系电话', :value.sync='phone')
    div.description
      // - p.line 订单只打印好装在信封放在每栋楼的一楼, 需要自取, 请留意订单状态
      p.line 每天19:00前下的订单当天送达, 其余第二天继续配送
      p.line 价格0.14元/单面   0.19元/双面   配送免费
    x-button.order(@click='confirm') 提交订单
</template>

<script>
import services from 'utils/services'
import XInput from 'vux-components/x-input'
import XButton from 'vux-components/x-button'
import Group from 'vux-components/group'

export default {
  components: {
    XInput,
    XButton,
    Group
  },
  methods: {
    confirm () {
      if (this.addr.length === 0) {
        services.utils.toast('请输入宿舍地址')
        return
      }
      if (!/^1[0-9]{10}$/.test(this.phone)) {
        services.utils.toast('请输入正确的手机号码')
        return
      }
      let form = {
        name: this.name,
        addr: this.addr,
        phone: this.phone
      }
      services.store.orderform = form
      form.list = this.list
      services.order.add(form).then(order => {
        services.utils.toast('提交成功')
        return services.order.pay(order.uuid)
      }).then(() => {
        window.history.back()
      })
    }
  },
  ready () {
    this.name = this.store.name
    this.addr = this.store.addr
    this.phone = this.store.phone
  },
  data () {
    return {
      name: '',
      addr: '',
      phone: ''
    }
  },
  computed: {
    store () {
      return services.store.orderform
    },
    list () {
      try {
        return JSON.parse(this.$route.params.list)
      } catch (e) {
        return []
      }
    },
    items () {
      try {
        let list = JSON.parse(this.$route.params.list)
        return list.map(i => ({
          good: this.goodMap[i[0]],
          count: i[1]
        }))
      } catch (e) {
        return []
      }
    },
    goodMap () {
      const list = services.good.store.list
      let ret = {}
      list.forEach(item => {
        ret[item.id] = item
      })
      return ret
    }
  }
}
</script>

<style lang="less" scoped>
.form-page {
  .description {
    &:before {
      content: '说明: ';
      display: inline;
    }
    padding: 10px;
    font-size: 10px;
    p {
      text-indent: 20px;
    }
  }
  .order {
    background-color: #508CEE;
    color: white;
    &:active {
      background-color: darken(#508CEE, 5%);
      color: white;
    }
  }
}
</style>
