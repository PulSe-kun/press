<!-- 生产查询 -->
<template>
  <div class="production-query">
    <div class="item-search">
      <div>
        <ul>
          <li>
            <span>产品任务批号：</span>
            <a-input placeholder="搜索产品任务批号" v-model="search.productTaskNum" style="width: 240px" />
          </li>
          <li>
            <span>产品型号：</span>
            <a-input placeholder="搜索产品型号" v-model="search.productModel" style="width: 240px" />
          </li>
          <li>
            <span>生产日期：</span>
            <a-config-provider :locale="locale">
              <a-range-picker style="width: 240px" @change="onChangeTime" />
            </a-config-provider>
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="searchInfo">查询</a-button>
      </div>
    </div>
    <div class="item-table">
      <div class="table">
        <a-spin :spinning="spinning">
          <a-config-provider :locale="locale" v-if="dataList.length">
            <a-table
              :columns="columns"
              :data-source="dataList"
              :pagination="pagination"
              @change="handleChange"
              :rowKey="
                (record, index) => {
                  return index;
                }
              "
            >
              <!-- <span slot="productTaskNum" slot-scope="productTaskNum">{{productTaskNum}}</span>
              <span slot="createTime" slot-scope="createTime">{{createTime}}</span>
              <span slot="productModel" slot-scope="productModel">{{productModel}}</span>
              <span slot="dieboldNum" slot-scope="dieboldNum">{{dieboldNum}}</span>
              <span slot="pressureTime" slot-scope="pressureTime">{{pressureTime}}</span>-->
              <span slot="createTime" slot-scope="createTime">{{createTime| filterTime(createTime)}}</span>
              <template slot="pressureValue" slot-scope="text, item">
                <span v-if="item.pressureValueMix==item.pressureValueMax">{{text}}</span>
                <a v-else @click="checkPressure(item)">{{ item.pressureValueMix }}~{{ item.pressureValueMax}}</a>
              </template>
              <template slot="faultInfo" slot-scope="text, item">
                <a v-if="text" @click="details(item)">{{ text }}个故障</a>
                <span v-else>--</span>
              </template>
            </a-table>
          </a-config-provider>
          <Empty v-else text="暂无数据~" :width="78" :height="64" color="#666666" />
        </a-spin>
      </div>
    </div>
    <template>
      <DetailsDialog ref="detailsDialog" :item="item" />
    </template>
    <template>
      <PressureDialog ref="pressureDialog" :item="item" />
    </template>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import Empty from '@/components/Empty/index'
import { getList } from '@/services/production/query'
import { DetailsDialog, PressureDialog } from './components/index'
import moment from 'moment'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Empty, DetailsDialog, PressureDialog },
  data() {
    // 这里存放数据
    return {
      locale: zhCN, // 国际化 设置成中文 www.itxst.com
      item: null,
      search: {
        endTime: '',
        pageNum: 0,
        productModel: '', // 产品型号
        productTaskNum: '', // 产品任务批号
        size: 10,
        startTime: '',
        date: []
      },
      dataList: [],
      spinning: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '30', '50', '80', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columns: [
        {
          title: '产品任务批号',
          dataIndex: 'productTaskNum',
          align: 'center',
          check: true
        },

        {
          title: '生产日期',
          dataIndex: 'createTime',
          align: 'center',
          check: true,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '产品型号',
          dataIndex: 'productModel',
          align: 'center',
          check: true
        },
        {
          title: '压弹数量',
          dataIndex: 'ydAmount',
          align: 'center',
          check: true
        },
        {
          title: '凸模编号',
          dataIndex: 'dieboldNum',
          align: 'center',
          check: true
        },
        {
          title: '药型罩批次编号',
          dataIndex: 'linerNum',
          align: 'center',
          check: true
        },
        {
          title: '压机压力(MPa)',
          dataIndex: 'pressureValue',
          align: 'center',
          scopedSlots: { customRender: 'pressureValue' },
          check: true
        },
        {
          title: '保压时间(s)',
          dataIndex: 'pressureTime',
          align: 'center',
          check: true
        },
        {
          title: '故障信息',
          dataIndex: 'faultInfo',
          scopedSlots: { customRender: 'faultInfo' },
          align: 'center',
          check: true
        }
      ]
    }
  },
  filters: {
    // 时间格式化
    filterTime(time) {
      return moment(time).format('YYYY-MM-DD')
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    init() {
      getList(this.search).then(res => {
        console.log(res)
        this.dataList = res.data.rows
      })
    },
    /** 详情 */
    details(item) {
      console.log(item)
      this.item = item
      this.$refs.detailsDialog.visible = true
    },
    onChangeTime(date, dateString) {
      console.log(date, dateString)
      this.search.startTime = dateString[0]
      this.search.endTime = moment(dateString[1]).endOf('day') // 相当一天最后时间'23:59:59'
    },
    handleChange(pagination) {
      this.pagination = pagination
    },
    searchInfo() {
      this.init()
    },
    checkPressure(item) {
      // console.log(1, item)
      this.item = item
      this.$refs.pressureDialog.visible = true
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.init()
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
.production-query {
  height: 100%;
  display: flex;
  flex-direction: column;
  .item-search {
    padding: 40px;
    padding-bottom: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    border-radius: 6px;
    div:first-child {
      ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        li {
          margin-bottom: 32px;
          list-style: none;
          float: left;
          margin-right: 60px;
          span:first-child {
            color: #000000;
            // margin-right: 15px;
          }
        }
      }
    }
    div:last-child {
      margin-bottom: 32px;
    }
  }
  .item-table {
    flex: auto;
    margin-top: 14px;
    padding: 49px 32px 0 32px;
    background: #ffffff;
    border-radius: 6px;
    .table {
      border: 1px solid #e6e6e6;
    }
  }
}
</style>
