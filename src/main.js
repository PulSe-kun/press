import Vue from 'vue'
import './assets/font/font.css'
import '../src/theme/index.less'
import '../src/assets/icons/iconfont.css'
import './assets/icons/index'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import store from './store'
// import 'echarts-gl'
import animated from 'animate.css'
import dataV from '@jiaminghi/data-view'
// 路由守卫
import './permission' // npm install animate.css --save安装，再引入
import 'echarts'
import ECharts from 'vue-echarts'

Vue.component('v-chart', ECharts)
Vue.use(animated)
Vue.use(dataV)
Vue.config.productionTip = false
Vue.use(Antd)
const echarts = require('echarts')
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
