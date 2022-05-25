<template>
  <div class="role-management">
    <div class="header">
      <div>
        <ul>
          <li>
            <span>角色信息：</span>
            <a-input placeholder="搜索角色名称、描述" v-model="role_value" style="width: 280px" />
          </li>
        </ul>
      </div>
      <div>
        <a-button class="default-style" @click="inqueryData">查询</a-button>
      </div>
    </div>
    <div class="personnel-management-table">
      <div class="table-btn">
        <a-button class="primary-style" type="primary" @click="newAdd">新建角色</a-button>
      </div>
      <div class="table-wrap">
        <a-spin :spinning="spinning">
          <a-config-provider :locale="locale" v-if="dataList.length">
            <a-table rowKey="id" :columns="columns" :data-source="dataList" :pagination="pagination" @change="handleChange">
              <a slot="roleName" class="primary-a text-style" slot-scope="text, item" @click="details(item)" :title="text">{{ text }}</a>
              <template slot="title_slot">
                <span style="margin-right: 8px">操作</span>
                <a-dropdown :trigger="['click']" placement="bottomCenter" :visible="isActive">
                  <a
                    class="ant-dropdown-link"
                    @click="
                      (e) => {
                        e.preventDefault();
                        isActive = true;
                      }
                    "
                  >
                    <img style="width: 16px; height: 16px; margin-top: -3px" src="../../../assets/imgs/More.png" alt />
                  </a>
                  <div class="more" slot="overlay">
                    <!-- <a-checkbox-group @change="onChange"> -->
                    <a-row>
                      <a-col
                        :span="24"
                        v-for="(item, index) in columnsAll"
                        :style="{
                          display:
                            item.dataIndex == 'operate' ? 'none' : 'block',
                        }"
                        :key="index"
                      >
                        <a-checkbox :checked="item.check" @change="onChange(item)">{{ item.title }}</a-checkbox>
                      </a-col>
                    </a-row>
                    <!-- </a-checkbox-group> -->
                    <div style="padding: 14px 0; text-align: center">
                      <a-button type="link" class="primary-a" style="color: #999" @click="reset">重置</a-button>
                      <a-button type="link" class="link-style" @click="sure">确定</a-button>
                    </div>
                  </div>
                </a-dropdown>
              </template>
              <template slot="members" slot-scope="item">
                <span v-for="(name, ind) in item" :key="ind">{{ name.name }}{{ ind + 1 == item.length ? "" : "，" }}</span>
              </template>
              <template slot="action" slot-scope="text, item">
                <span
                  v-if="
                    item.id == '7d6a7f658c214a719bf2903aa1853f83' ||
                    item.id == '27b4207cbf4840c7afc9787bf4e336e5' ||
                    item.id == '84c1cece1abf49bd800d5adcf4c1c42a'
                  "
                >--</span>
                <span v-else>
                  <a style="margin-right: 15px" class="link-style primary-a" @click="compile(item)">编辑</a>
                  <a style="margin-right: 15px" class="link-style primary-a" @click="maintenanceMembers(item)">维护成员</a>
                </span>
              </template>
            </a-table>
          </a-config-provider>
          <Empty text="暂无日志" v-else />
        </a-spin>
      </div>
    </div>
    <template>
      <Details_dialog ref="details_dialog" :item="item" @refresh="refresh" />
      <NewAdd_dialog ref="newAdd_dialog" @refresh="refresh" />
      <Compile_dialog ref="compile_dialog" :item="item" @refresh="refresh" />
      <MaintenanceMembers_dialog ref="maintenanceMembers_dialog" :item="item" @refresh="refresh" />
    </template>
  </div>
</template>

<script>
import { Details_dialog, NewAdd_dialog, Compile_dialog, MaintenanceMembers_dialog } from './components/index'
import Empty from '@/components/Empty/index'
import { getSysRoles } from '@/services/api_user'
import { refresh } from '@/services/api_system'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data() {
    return {
      item: null,
      spinning: false,
      isActive: false,
      role_value: '',
      locale: zhCN, // 国际化 设置成中文 www.itxst.com
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        defaultPageSize: 10, // 每页显示几条数据
        showSizeChanger: true, // 显示下拉选项（每页几条）
        showTotal: total => `共 ${total} 条数据`,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        onShowSizeChange: (current, pageSize) => (this.pageSize = pageSize)
      },
      columns: [],
      columnsAll: [
        {
          title: '角色名称',
          dataIndex: 'roleName',
          check: true,
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'roleName' }
        },
        {
          title: '角色描述',
          dataIndex: 'description',
          check: true,
          width: 150,
          ellipsis: true,
          align: 'center'
        },
        {
          title: '包含成员',
          dataIndex: 'members',
          scopedSlots: { customRender: 'members' },
          check: true,
          align: 'center'
        },
        {
          width: 150,
          dataIndex: 'operate',
          align: 'center',
          scopedSlots: { title: 'title_slot', customRender: 'action' }
        }
      ]
    }
  },
  components: {
    Details_dialog,
    NewAdd_dialog,
    Compile_dialog,
    MaintenanceMembers_dialog,
    Empty
  },
  created() {
    const list = []
    for (let i = 0; i < this.columnsAll.length; i++) {
      this.columnsAll[i].check = true
      if (this.columnsAll[i].check) {
        list.push(this.columnsAll[i])
      }
    }
    this.columns = list
  },
  mounted() {
    this.refreshData()
    this.getSysRolesData({
      like: this.role_value,
      limit: this.pagination.pageSize,
      page: this.pagination.current,
      column: 'createTime',
      sort: 'desc'
    })
  },
  methods: {
    /** 刷新角色权限缓存 */
    refreshData() {
      refresh().then(res => {
        // console.log(res, 1111);
      })
    },
    /** 维护成员 */
    maintenanceMembers(item) {
      this.item = item
      this.$refs.maintenanceMembers_dialog.visible = true
    },
    /** 获取角色数据 */
    getSysRolesData(params) {
      this.spinning = true
      getSysRoles(params).then(res => {
        this.spinning = false
        console.log(res)
        if (res.status === 200) {
          this.dataList = res.data.rows
          this.pagination.total = res.data.total
        }
      })
    },
    /** 新增人员 */
    newAdd() {
      this.$refs.newAdd_dialog.visible = true
    },
    /** 详情 */
    details(item) {
      // console.log(item);
      this.item = item
      this.$refs.details_dialog.visible = true
    },
    /** 编辑 */
    compile(item) {
      // console.log(item);
      this.item = item
      this.$refs.compile_dialog.visible = true
    },
    /** 重置表格 */
    reset() {
      const list = []
      for (let i = 0; i < this.columnsAll.length; i++) {
        this.columnsAll[i].check = true
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i])
        }
      }
      this.columns = list
      this.isActive = false
    },
    /** 确定更改的表格 */
    sure() {
      const list = []
      for (let i = 0; i < this.columnsAll.length; i++) {
        if (this.columnsAll[i].check) {
          list.push(this.columnsAll[i])
        }
      }
      this.columns = list
      this.isActive = false
    },
    onChange(item) {
      // console.log(check);
      item.check = !item.check
      this.$forceUpdate()
    },
    /** 查询 */
    inqueryData() {
      const params = {
        like: this.role_value,
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        column: 'createTime',
        sort: 'desc'
      }
      this.getSysRolesData(params)
    },
    refresh() {
      this.refreshData()
      const params = {
        like: this.role_value,
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        column: 'createTime',
        sort: 'desc'
      }
      this.getSysRolesData(params)
    },
    handleChange(pagination) {
      // console.log(pagination);
      this.pagination = pagination
      const params = {
        like: this.role_value,
        limit: this.pagination.pageSize,
        page: this.pagination.current,
        column: 'createTime',
        sort: 'desc'
      }
      this.getSysRolesData(params)
    }
  }
}
</script>

<style scoped lang="less">
.role-management {
  height: 100%;
  overflow: auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .header {
    padding: 17px 5px 36px 0;
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
  .personnel-management-table {
    border-radius: 5px;
    border: 1px solid #e6e6e6;
    .table-btn {
      padding: 21px 0 33px 30px;
      button {
        margin-right: 20px;
      }
    }
    .table-wrap {
      .personnel-management-content {
        flex: 1;
        height: 100%;
        margin-left: 41px;
      }
    }
  }
}
.more {
  max-width: 150px;
  background: #ffffff;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  .ant-col-24 {
    height: 32px;
    line-height: 32px;
    padding-left: 12px;
  }
}
</style>
