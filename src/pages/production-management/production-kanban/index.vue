<!-- 生产看板 -->
<template>
  <div class="production-kanban" ref="dashboard_main">
    <!-- <div @click="fullScreen" class="fullButton"> -->
    <!-- <expand-outlined /> -->
    <!-- </div> -->
    <a-row :gutter="[15, 15]">
      <a-col :xs="24" :sm="24" :md="24" :lg="17">
        <div class="item-model">
          <h3 class="item-title">实时压机压力曲线图</h3>
          <!-- <div ref="press" v-if="pressureList.length > 0"></div> -->
          <v-chart :option="option_column" style="height: 80%" v-if="pressureList.length > 0"></v-chart>
          <div v-show="pressureList.length == 0">
            <Empty text="无压力数据~" :imgSrc="require('@/assets/imgs/empty.png')" :width="60" :height="50" :fontSize="16" color="#666666" />
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="7">
        <div class="item-model item-production-inf" v-if="productionInfo.productModel !=null">
          <a-descriptions title="今日生产信息(当前批次)" :column="1">
            <a-descriptions-item label="产品任务批号">{{productionInfo.productTaskNum}}</a-descriptions-item>
            <a-descriptions-item label="产品型号">{{productionInfo.productModel}}</a-descriptions-item>
            <a-descriptions-item label="压弹数量">{{productionInfo.ydAmount}}</a-descriptions-item>
            <a-descriptions-item label="凸模编号">{{productionInfo.dieboldNum}}</a-descriptions-item>
            <a-descriptions-item label="药型罩批次编号">{{productionInfo.linerNum}}</a-descriptions-item>
            <a-descriptions-item label="保压时间">{{productionInfo.pressureTime}}s</a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="item-model" v-if="productionInfo.productModel== null">
          <h3 class="item-title">今日生产信息(当前批次)</h3>
          <div>
            <Empty text="当前无任务批次~" :imgSrc="require('@/assets/imgs/wushuju.png')" :width="60" :height="50" :fontSize="16" color="#666666" />
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="[15, 15]">
      <a-col :xs="24" :sm="24" :md="24" :lg="17">
        <div class="item-model">
          <h3 class="item-title">故障次数统计(近15天)</h3>
          <v-chart :option="option_column2" style="height: 80%" v-if="For15Days.length > 0"></v-chart>
          <div v-show="For15Days.length == 0">
            <Empty text="无故障信息~" :imgSrc="require('@/assets/imgs/empty.png')" :width="60" :height="50" :fontSize="16" color="#666666" />
          </div>
        </div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="7">
        <div class="item-model item-fault-inf" v-if="For24H.length > 0">
          <a-descriptions title="故障警报(24h)" :column="1">
            <a-descriptions-item>
              <div class="d-flex jc-between ai-center" v-for="item in For24H" :key="item.index">
                <div>
                  <span>{{item.day.substr(5)}}</span>
                  <span>{{item.faultName}}</span>
                </div>
                <div class="d-flex ai-center" v-if="item.faultState==1">
                  <span class="not-style"></span>
                  <span class="not-title">未关闭</span>
                </div>
                <div class="d-flex ai-center" v-if="item.faultState==2">
                  <span class="has-style"></span>
                  <span class="has-title">已关闭</span>
                </div>
              </div>
            </a-descriptions-item>
          </a-descriptions>
        </div>
        <div class="item-model" v-if="For24H.length == 0">
          <h3 class="item-title">故障警报(24h)</h3>
          <div>
            <Empty text="无故障警报~" :imgSrc="require('@/assets/imgs/wushuju.png')" :width="60" :height="50" :fontSize="16" color="#666666" />
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Empty from '@/components/Empty/index'
import { getRunningTask, getListFor15Days, getListFor24H, getItemsFor1HourMinutes } from '@/services/production/kanban'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Empty },
  data() {
    // 这里存放数据
    return {
      echartsPress: null,
      echartsFault: null,
      productionInfo: {}, // 今日生产信息
      For15Days: [],
      For24H: [],
      pressureList: [], // 实时压机
      failureNum: [], // 故障次数
      uuid: '',
      option_column: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter: params => {
            let html = params[0].name + '<br>'
            for (let i = 0; i < params.length; i++) {
              html += params[i].marker + params[i].seriesName + ': ' + params[i].value
              html += 'MPa' + '<br>'
            }
            return html
          }
        },
        grid: {
          left: '8%',
          right: '4%',
          top: '20%',
          bottom: '14%'
        },
        xAxis: {
          show: true,
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 102, 102, .4)'
            }
          },
          splitLine: {
            show: false
          },
          // axisTick: {
          //   show: false,
          // },
          splitArea: {
            show: false
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            show: false,
            padding: [3, 0, 0, 0],
            color: 'rgba(168, 177, 187, 1)'
          },
          data: []
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#666666',
            fontSize: 14,
            formatter: '{value}'
          },
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: '实时压机压力曲线图',
            type: 'line',
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: {
              color: '#3DF7E4',
              shadowColor: '#61ADF7',
              shadowBlur: 20,
              borderColor: '#61ADF7',
              borderWidth: 4
            },
            lineStyle: {
              width: 1,
              color: '#61ADF7',
              shadowColor: '#61ADF7',
              shadowBlur: 20
            },
            data: []
          }
        ]
      },
      option_column2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter: params => {
            let html = params[0].name + '<br>'
            for (let i = 0; i < params.length; i++) {
              html += params[i].marker + params[i].seriesName + ': ' + params[i].value
              html += '个' + '<br>'
            }
            return html
          }
        },
        grid: {
          left: '8%',
          right: '4%',
          top: '20%',
          bottom: '14%'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: 'rgba(102, 102, 102, .4)'
            }
          },
          splitLine: {
            show: false
          },
          // axisTick: {
          //   show: false,
          // },
          splitArea: {
            show: false
          },
          axisLabel: {
            show: true,
            fontSize: 12,
            padding: [3, 0, 0, 0],
            color: 'rgba(168, 177, 187, 1)'
          },
          data: []
        },
        yAxis: {
          type: 'value',
          minInterval: 1, // 刻度只显示整数
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#666666',
            fontSize: 16,
            formatter: '{value}'
          },
          splitArea: {
            show: false
          }
        },
        series: [
          {
            name: '故障次数统计（近15天）',
            type: 'line',
            showAllSymbol: true,
            symbol: 'circle',
            symbolSize: 4,
            itemStyle: {
              color: '#EF4F51',
              shadowColor: '#EF4F51',
              shadowBlur: 20,
              borderColor: '#DE6993',
              borderWidth: 4
            },
            lineStyle: {
              width: 1,
              color: '#DE6993',
              shadowColor: '#DE6993',
              shadowBlur: 20
            },
            data: []
          }
        ]
      }
    }
  },

  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    // 全屏
    // fullScreen() {
    //   if (screenfull.isEnabled) {
    //     // 控制是否全屏的按钮
    //     screenfull.toggle(this.$refs.dashboard_main)
    //   }
    // },
    init() {
      getRunningTask().then(res => {
        console.log(res)
        this.productionInfo = res.data
        this.uuid = res.data.uuid
        getItemsFor1HourMinutes(this.uuid).then(res => {
          console.log(res)
          this.pressureList = res.data.rows
          // 给echarts data赋值
          const arr3 = []
          const arr4 = []
          this.pressureList.forEach(ele => {
            arr3.push({
              value: ele.pressureValue
            })
            arr4.push({
              value: ele.createTime
            })
          })
          if (this.pressureList.length > 0) {
            this.option_column1.series[0].data = arr3
            this.option_column1.xAxis.data = arr4
          }
        })
      })
      getListFor15Days().then(res => {
        console.log(res)
        this.For15Days = res.data.rows
        // 给echarts data赋值
        const arr = []
        const arr2 = []
        this.For15Days.forEach(ele => {
          arr.push({
            value: ele.amount
          })
          arr2.push({
            value: ele.day
          })
        })
        if (this.For15Days.length > 0) {
          this.option_column2.series[0].data = arr
          this.option_column2.xAxis.data = arr2
        }
      })
      getListFor24H().then(res => {
        console.log(res)
        this.For24H = res.data.rows
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // 这里一般写函数的声明。页面创建完成时，除非此函数
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // 👉优化刷新 每隔1分钟刷新
    this.init()
    let timer = setInterval(() => {
      this.init()
    }, 1000 * 60)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
      timer = null
    })
  },
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
.production-kanban {
  position: relative;
  width: 100%;
  height: 100%;
  //overflow-x: hidden;
  // overflow-y: hidden;
  padding: 0 7px; /* 给gutter留padding */
  .item-model {
    margin-left: -7px;
    //height: 450px;
    @media (min-width: 1200px) {
      height: 300px;
    }
    @media (min-width: 1920px) {
      height: 460px;
    }
    background: @primary-bg-color;
    box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    .item-title {
      padding: 20px 0 0 40px;
      font-size: 20px;
      color: #ffffff;
      font-weight: normal;
    }
    > div {
      @media (min-width: 1200px) {
        height: 280px;
      }
      @media (min-width: 1920px) {
        height: 400px;
      }
    }
  }
  .item-production-inf {
    padding: 20px 40px;
    background: linear-gradient(159deg, #ab8aff, #3e3df1) !important;
  }
  .item-fault-inf {
    padding: 24px 40px;
    background: linear-gradient(159deg, #ffa691, #ed474b) !important;
    /deep/.ant-descriptions-item-content {
      width: 100%;
      > div > div:nth-child(1) {
        color: #fff;
        line-height: 35px;
        span:first-child {
          margin-right: 10px;
        }
      }
      > div > div:nth-child(2) {
        .not-style {
          width: 12px;
          height: 13px;
          border: 2px solid #ef4f51;
          border-radius: 50%;
          margin-right: 5px;
        }
        .not-title {
          color: #ef4f51;
        }
        .has-style {
          width: 12px;
          height: 13px;
          border: 2px solid #544cf4;
          border-radius: 50%;
          margin-right: 5px;
        }
        .has-title {
          color: #544cf4;
        }
      }
    }
  }
}
</style>

<style lang="less" scoped>
/deep/.ant-descriptions {
  .ant-descriptions-title {
    font-size: 20px;
    color: #fff;
  }
}
/deep/.ant-descriptions-item-label {
  color: #fff;
}
/deep/.ant-descriptions-item-content {
  color: #fff;
}
/* .fullButton {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #0a052e;
  z-index: 99;
} */
</style>
