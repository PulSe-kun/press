<!-- 首页 -->
<template>
  <div class="home">
    <div class="home-img">
      <img src="../../assets/imgs/home.png" alt />
      <h1>欢迎使用川南航天能源管理平台～</h1>
    </div>
  </div>
</template>

<script>
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {}
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    changeTheme(primaryColor) {
      window.less
        .modifyVars({
          '@primary-color': primaryColor
        })
        .then(() => {
          console.log('成功')
        })
        .catch(error => {
          alert('失败')
          console.log(error)
        })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // 这里一般写函数的声明。页面创建完成时，除非此函数
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {} // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  overflow: auto;
  background: @primary-bg-color;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  .home-img {
    text-align: center;

    img {
      margin: 175px 0 51px 0;
      width: 278px;
      height: 317px;
    }
    h1 {
      font-size: 40px;
      color: #fefefe;
      line-height: 40px;
    }
  }
}
</style>
