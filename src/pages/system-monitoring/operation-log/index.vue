<template>
  <div class="operation-log">
    <div class="header" ref="header">
      <div>
        <ul>
          <li>
            <span>操作内容：</span>
            <a-input placeholder="搜索操作内容" v-model="like" style="width: 280px" />
          </li>
          <li>
            <span>操作人：</span>
            <a-select show-search placeholder="请选择操作人" option-filter-prop="children" style="width: 280px" allowClear v-model="userId">
              <a-select-option v-for="item in userIdList" :key="item.id" :value="item.id">{{ item.username }}</a-select-option>
            </a-select>
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="query_data">查询</a-button>
      </div>
    </div>
    <div class="operation-log-table">
      <a-spin :spinning="spinning">
        <a-config-provider :locale="locale" v-if="dataList.length">
          <a-table
            :columns="columns"
            :data-source="dataList"
            :pagination="pagination"
            @change="handleChange"
            :rowKey="
              (record, index) => {
                return record.id;
              }
            "
          ></a-table>
        </a-config-provider>
        <Empty text="暂无日志" v-else />
      </a-spin>
    </div>
  </div>
</template>

<script>
import { getlog, getUserId } from '../../../services/api_log'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import Empty from '@/components/Empty/index'
const columnsAll = [
  {
    title: '操作系统',
    dataIndex: 'applicationName',
    align: 'center',
    check: true
  },
  {
    title: '操作菜单',
    dataIndex: 'type',
    align: 'center',
    check: true
  },
  {
    title: '操作内容',
    dataIndex: 'operation',
    align: 'center',
    check: true
  },
  {
    title: '操作人',
    dataIndex: 'userName',
    align: 'center',
    check: true
  },
  {
    title: '操作时间',
    dataIndex: 'timestamp',
    align: 'center',
    check: true
  }
  // {
  //   dataIndex: "operate",
  //   scopedSlots: { title: "title_slot", customRender: "action" },
  // },
]
export default {
  data() {
    return {
      like: '',
      isActive: false,
      userId: undefined,
      userIdList: [],
      locale: zhCN, // 国际化 设置成中文 www.itxst.com
      dataList: [],
      spinning: false,
      pagination: {
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columns: [],
      columnsAll
    }
  },
  components: { Empty },
  created() {
    const list = []
    for (let i = 0; i < this.columnsAll.length; i++) {
      this.columnsAll[i].check = true
      if (this.columnsAll[i].check) {
        list.push(this.columnsAll[i])
      }
    }
    this.columns = list
    this.$nextTick(function () {
      getUserId().then(res => {
        console.log(res)
        if (res.status == 200) {
          this.userIdList = res.data.rows
        }
      })
    })
  },
  mounted() {
    const params = {
      like: this.like,
      limit: this.pagination.pageSize,
      sort: 'desc',
      page: 1
    }
    if (this.userId) {
      params.userId = this.userId
    }
    this.getLog_data(params)
  },
  methods: {
    /** 查询 筛选 */
    query_data() {
      const params = {
        like: this.like,
        limit: this.pagination.pageSize,
        sort: 'desc',
        page: 1
      }
      // console.log(this.userId)
      if (this.userId) {
        params.userId = this.userId
      }
      this.getLog_data(params)
    },
    /** 获取日志列表 */
    getLog_data(params) {
      this.spinning = true
      getlog(params).then(res => {
        // console.log(res);
        this.spinning = false
        if (res.status === 200) {
          this.dataList = res.data.rows
          this.pagination.total = res.data.total
        }
      })
    },
    onChange(item) {
      // console.log(check);
      item.check = !item.check
      this.$forceUpdate()
    },
    handleChange(pagination) {
      // console.log(pagination);
      const params = {
        limit: pagination.pageSize,
        page: pagination.current,
        like: this.like,
        sort: 'desc'
      }
      if (this.userId) {
        params.userId = this.userId
      }
      this.getLog_data(params)
    }
  }
}
</script>

<style scoped lang="less">
.operation-log {
  height: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 46px 22px 36px 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:first-child {
      ul {
        margin: 0;
        padding: 0;
        li {
          list-style: none;
          float: left;
          margin-right: 60px;
          span:first-child {
            margin-right: 20px;
          }
        }
      }
    }
  }
  .operation-log-table {
    margin: 0 20px 20px 20px;
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    .personnel-management-content {
      flex: 1;
      height: 100%;
      margin-left: 41px;
      .header {
        padding: 45px 7px 35px 1px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div:first-child {
          ul {
            margin: 0;
            padding: 0;
            li {
              list-style: none;
              float: left;
              margin-right: 60px;
              span:first-child {
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
