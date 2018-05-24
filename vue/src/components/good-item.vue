<template lang="pug">
  .good-item
    img(:src='image')
    .detail
      .name(v-text='name')
      slot(name='middle')
        .price(v-text='"￥"+price.toFixed(2)')
      .clear
      .slot
        slot
</template>

<script>
const unknownIcon = require('assets/icon/file/other.png')
export default { // 商品item
  name: 'good-item',
  props: {
    name: {
      required: true
    },
    price: {
      default: 0
    },
    image: {
      default: unknownIcon
    }
  }
}
</script>

<style lang='less' scoped>
@v-pad: 10px;
@h-pad: 10px;
@height: 120px;
@img-width: @height / 1.414;
.good-item {
  height: @height;
  padding: @v-pad @h-pad;
  position: relative;
  img {
    width: @img-width;
    height: @height;
  }
  .detail {
    position: absolute;
    top: @v-pad;
    bottom: @v-pad;
    right: @v-pad;
    left: @img-width + @h-pad * 3;
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 46px;
    }
    .price {
      color: red;
      font-weight: bold;
    }
    .slot {
      margin-top: 10px;
      height: 29px;
      width: 100%;
    }
  }
}
</style>
