<template>
  <div class="modal-mask" v-show="show" transition="modal" @click="onHide" :style='maskStyle'>
    <div class="modal-wrapper">
      <div class="modal-container" @click.stop="">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import services from 'utils/services'
export default { // 向上弹出的页面
  name: 'popup',
  data: () => ({
  }),
  methods: {
    onHide () {
      this.show = false
    }
  },
  props: {
    show: {
      default: false,
      twoWay: true
    }
  },
  watch: {
  },
  computed: {
    contentHeight () {
      return this.$root.contentHeight
    },
    barHeight () {
      return services.config.statusBarHeight
    },
    maskStyle () {
      return {
        paddingTop: `${this.barHeight}px`,
        height: `${this.contentHeight}px`
      }
    }
  }
}
</script>

<style scoped lang="less">
.modal-mask {
  display: table;

  overflow-x: hidden;
  overflow-y: hidden;

  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  // height: 100%;

  background-color: rgba(0, 0, 0, .5);
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 100%;
  height: 100%;

  margin: 0px auto; 
  // padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}

.modal-transition {
  transition: all .3s ease;
}
.modal-leave , .modal-enter {
  opacity: 0.99;
}

.modal-enter .modal-container {
  transform: translateY(100%);
}
.modal-leave .modal-container {
  transform: translateY(100%);
}
</style>