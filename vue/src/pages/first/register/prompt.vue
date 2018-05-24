<template lang="pug">
group
  cell(v-if='data.type=="image"', @click='$emit("click")')
    img(slot='icon', :src='imgSrc')
  x-input(:placeholder='data.desc', :value.sync='value')
  cell(v-if='unsupport', title='你的客户端版本太旧, 不支持从该学校登录, 请更新到最新版')
    icon(type='warn', slot='icon')
</template>
<script>
import Group from 'vux-components/group'
import Cell from 'vux-components/cell'
import XInput from 'vux-components/x-input'
import Icon from 'vux-components/icon'
export default { // ????
  components: {
    Group,
    Cell,
    XInput,
    Icon
  },
  computed: {
    unsupport () {
      return !['image'].includes(this.data.type)
    },
    imgSrc () {
      return `data:image/jpeg;base64,${this.data.data}`
    }
  },
  props: {
    name: {
      required: true
    },
    data: {
      required: true
    },
    value: {
      twoWay: true
    }
  }
}
</script>