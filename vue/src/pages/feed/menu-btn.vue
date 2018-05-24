<template lang="pug">
.menu-btn(@click.self='visible=true')
  div(v-if='visible', v-transfer-dom)
    mt-actionsheet(:visible.sync='visibleAfter', :actions='actions', @transitionend='onTransitionend')
</template>

<script>
export default { // 学生圈每个帖子右上角的操作按钮
  props: {
    actions: {
      default: () => []
    }
  },
  data () {
    return {
      visible: false, // visible为true时, 底部弹出操作的选项  复制或删除 这两个操作是通过props的参数action传下来的  定义见 feed 或 deed-detail
      visibleAfter: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(() => this.visibleAfter = true)
      }
    }
  },
  methods: {
    onTransitionend () {
      if (!this.visibleAfter) {
        this.visible = false
      }
    }
  }
}
</script>

<style>
.menu-btn {
  display: inline-block;
  background-image: url("~assets/icon/xsq/cell_operate.png");
  width: 40px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 20px;
}
</style>