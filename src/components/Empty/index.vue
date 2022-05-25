<template>
  <div class="empty-wrap" :style="'transform:scale(' + scale + ')'">
    <img :src="imgSrc || require('@/assets/imgs/empty.png')" alt :style="{ width: width + 'px', height: height + 'px' }" />
    <div :style="{ 'font-size': fontSize + 'px', color: color }">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    /** 空数据文案 */
    text: {
      type: String,
      default: ''
    },
    /** 图片路径 */
    imgSrc: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 78
    },
    height: {
      type: Number,
      default: 64
    },
    fontSize: {
      type: Number,
      default: 16
    },
    color: {
      type: String,
      default: ''
    },
    scale: {
      type: Number,
      default: 1
    }
  }
}
</script>
<style lang="less" scoped>
.empty-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  img {
    margin-bottom: 20px;
  }
  div {
  }
}
</style>
