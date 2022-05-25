<template>
  <div class="personnel-management">
    <div class="left-sider">
      <div class="left-sider-tree">
        <img
          style="
            position: absolute;
            left: 0;
            top: 0;
            width: 220px;
            height: 63px;
            border-bottom: 1px dashed #979797;
          "
          src="@/assets/imgs/treeImg.png"
          alt
        />
        <a-tree
          v-if="treeData.length"
          :tree-data="treeData"
          :replaceFields="{
            children: 'children',
            title: 'deptName',
            key: 'id',
          }"
          :selectedKeys="selectedKeys"
          @select="select_tree"
          :defaultExpandedKeys="expandedRowKeys"
        >
          <template slot="deptName" slot-scope="item" style="color: #08c">
            <p class="tree-font">
              <span class="dot"></span>
              {{ item.deptName }}
            </p>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="personnel-management-content">
      <div class="header">
        <div>
          <ul>
            <li>
              <span>人员信息：</span>
              <a-input v-model="like" placeholder="搜索人员姓名、账号" style="width: 280px" />
            </li>
          </ul>
        </div>
        <div>
          <a-button class="default-style" @click="query_data">查询</a-button>
        </div>
      </div>
      <div class="personnel-management-table">
        <div class="table-btn">
          <a-button class="primary-style" type="primary" @click="newAdd">新建人员</a-button>
        </div>
        <div class="table-wrap">
          <a-spin :spinning="spinning">
            <a-config-provider :locale="locale" v-if="dataList.length">
              <a-table
                :columns="columns"
                :data-source="dataList"
                :pagination="pagination"
                @change="handleChange"
                :rowKey="
                  (record, index) => {
                    return record.baseUser.id;
                  }
                "
              >
                <a slot="name" class="primary-a text-style" slot-scope="text, item" @click="details(item)">{{ text }}</a>
                <span slot="baseUser" slot-scope="item">
                  {{
                  item.employeeNumber
                  }}
                </span>
                <span slot="username" slot-scope="item">{{ item }}</span>
                <div slot="isDisabled" slot-scope="item">
                  <span v-if="item == 0">正常</span>
                  <span v-if="item == 1">
                    <span
                      style="
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 5px;
                        margin-right: 5px;
                        background: #c41a1a;
                      "
                    ></span>停用
                  </span>
                </div>
                <div slot="roles" slot-scope="item">
                  <div v-for="(roleName, i) in item" :key="i">
                    <span v-if="roleName == null">暂无角色</span>
                    <span v-else>{{ roleName.roleName }}</span>
                  </div>
                </div>
                <span slot="depts" slot-scope="item">{{ item.deptName }}</span>
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
                        <a-button type="link" class="link-style primary-a" @click="sure">确定</a-button>
                      </div>
                    </div>
                  </a-dropdown>
                </template>
                <template slot="action" slot-scope="text, item">
                  <span
                    v-if="
                      item.id == 'bb293ea285d14dec86a6fa90cfac30ef' ||
                      item.id == '5930adc918db49cdbc88bef4f6048213' ||
                      item.id == '0515ba6bb3f34bc384762e723c63a7cc'
                    "
                  >--</span>
                  <a v-else class="link-style primary-a" @click="compile(item)">编辑</a>
                </template>
              </a-table>
            </a-config-provider>
            <Empty text="暂无人员" v-else />
          </a-spin>
        </div>
      </div>
    </div>
    <template>
      <Details_dialog ref="details_dialog" :dataObj="dataObj" @refresh="refresh" />
      <NewAdd_dialog
        ref="newAdd_dialog"
        :treeData="treeData"
        :treeId="selectedKeys[0]"
        :expandedRowKeys="expandedRowKeys"
        @refresh="refresh"
      />
      <Compile_dialog ref="compile_dialog" :treeData="treeData" :expandedRowKeys="expandedRowKeys" :dataObj="dataObj" @refresh="refresh" />
    </template>
  </div>
</template>

<script>
import { Details_dialog, NewAdd_dialog, Compile_dialog } from './components/index'
import Empty from '../../../components/Empty/index'
import { getBaseDepts, getBaseUsers } from '../../../services/api_user'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data() {
    return {
      pid: '',
      level: 0,
      spinning: false,
      treeData: [],
      expandedRowKeys: [],
      selectedKeys: [], // 选中的节点
      treeId: '', // 代表唯一标识的id
      count: 0,
      list: [],
      // tree_id: "", //代表唯一标识的id
      isActive: false,
      locale: zhCN, // 国际化 设置成中文 www.itxst.com
      dataList: [],
      dataObj: null,
      like: '',
      pagination: {
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
          title: '姓名',
          dataIndex: 'name',
          check: true,
          align: 'center',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '工号',
          dataIndex: 'baseUser',
          check: true,
          align: 'center',
          scopedSlots: { customRender: 'baseUser' }
        },
        {
          title: '账号',
          dataIndex: 'username',
          check: true,
          align: 'center',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '角色',
          dataIndex: 'roles',
          check: true,
          align: 'center',
          scopedSlots: { customRender: 'roles' }
        },
        {
          title: '所属组织',
          dataIndex: 'depts',
          check: true,
          align: 'center',
          scopedSlots: { customRender: 'depts' }
        },
        {
          title: '状态',
          dataIndex: 'isDisabled',
          check: true,
          align: 'center',
          scopedSlots: { customRender: 'isDisabled' }
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
    this.getBaseDeptsData()
  },
  methods: {
    /** 展示树形结构 三层 */
    getAllTreeList(list) {
      if (this.count > 3) {
      } else {
        list.map(item => {
          this.list.push(item.id)
          if (item.hasOwnProperty('children') && item.children.length > 0) {
            this.count++
            this.getAllTreeList(item.children)
          }
        })
      }
    },
    /** 加点 */
    setNode(data, parentId) {
      if (this.pid != parentId) {
        this.level++
      }
      this.pid == parentId
      var num
      for (var i = 0; i < data.length; i++) {
        num = i
        // data[i].parentId = parentId;
        if (data[i].count !== 0) {
          data[i].deptName = data[i].deptName + '(' + data[i].count + '人)'
        }
        data[i].level = this.level
        if (data[i].children && data[i].children.length > 0) {
          if (this.level <= 2) {
            this.list.push(data[i].id)
          }
          this.setNode(data[i].children, data[i].id)
        } else {
          data[i].scopedSlots = { title: 'deptName' }
        }
      }
      if (num === data.length - 1) {
        this.level = data[0].level - 1
      }
      return data
    },
    /** 获取人员树 */
    async getBaseDeptsData() {
      const { data, status } = await getBaseDepts({ userCount: true })
      // console.log(data, status);
      if (status === 200) {
        // this.count = 0;
        // this.getAllTreeList(data);
        this.setNode(data)
        this.expandedRowKeys = this.list
        this.treeData = data
        // console.log(this.treeData);
        this.treeId = this.treeData[0].id
        this.getBaseUsersData(this.treeData[0].id, {
          like: this.like,
          limit: this.pagination.pageSize,
          sort: 'desc',
          page: 1
        })
      }
    },
    /**
     *
     *点击树节点
     */
    select_tree(selectedKeys, { selectedNodes }) {
      // console.log(selectedKeys, selectedNodes);
      this.selectedKeys = selectedKeys
      this.treeId = selectedKeys[0]
      this.getBaseUsersData(selectedKeys[0], {
        like: this.like,
        limit: this.pagination.pageSize,
        sort: 'desc',
        page: 1
      })
    },
    /** 查询 筛选 */
    query_data() {
      this.getBaseUsersData(this.treeId, {
        like: this.like,
        limit: this.pagination.pageSize,
        sort: 'desc',
        page: 1
      })
    },
    /**
     * 获取人员信息数据
     */
    getBaseUsersData(id, params) {
      // this.tree_id = id;
      // console.log(this.tree_id, params);
      this.spinning = true
      getBaseUsers(id, params)
        .then(res => {
          // console.log(res);
          this.spinning = false
          if (res.status === 200) {
            this.dataList = res.data.rows
            this.pagination.total = res.data.total
          }
        })
        .catch(error => {
          // console.log(error);
          this.spinning = false
        })
    },
    /** 刷新人员列表 */
    refresh() {
      // this.selectedKeys = [this.treeData[0].id];
      // this.treeId = this.treeData[0].id;
      // this.getBaseUsersData(this.treeId, {
      //   like: this.like,
      //   limit: this.pagination.pageSize,
      //   sort: "desc",
      //   page: 1,
      // });
      this.getBaseDeptsData()
    },
    /** 新增人员 */
    newAdd() {
      this.$refs.newAdd_dialog.visible = true
    },
    /** 详情 */
    details(item) {
      // console.log(item);
      this.dataObj = item
      this.$refs.details_dialog.visible = true
    },
    /** 编辑 */
    compile(item) {
      // console.log(item);
      this.dataObj = item
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
    handleChange(pagination) {
      // console.log(pagination);
      const params = {
        like: this.like,
        limit: pagination.pageSize,
        page: pagination.current,
        sort: 'desc'
      }
      this.getBaseUsersData(this.treeId, params)
    }
  }
}
</script>

<style lang="less" scoped >
.personnel-management {
  height: 100%;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  display: flex;
  .left-sider {
    height: calc(100% - 42px);
    margin-left: 20px;
    margin-top: 20px;
    margin-bottom: 22px;
    background: #ffffff;
    flex: 0 0 220px;
    .left-sider-btn {
      padding: 10px 0 20px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .left-sider-tree {
      position: relative;
      height: 100%;
      padding: 25px 20px;
      border: 1px dashed #979797;
      .tree-font {
        display: flex;
        flex-direction: row;
        align-items: center;
        .dot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background-color: #595959;
          border-radius: 50%;
          margin-left: -4px;
          margin-right: 9px;
        }
        span:last-child {
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }
  .personnel-management-content {
    flex: 1;
    height: 100%;
    margin-left: 41px;
    .header {
      padding: 45px 22px 35px 1px;
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
      // height: calc(100% - 133px);
      margin-right: 20px;
      margin-bottom: 21px;
      border-radius: 5px;
      border: 1px solid #e6e6e6;
      .table-btn {
        padding: 21px 0 33px 30px;
        button {
          margin-right: 20px;
        }
      }
    }
  }
}
.ant-tree {
  overflow: auto;
  max-width: 180px;
  margin-top: 68px;
  height: calc(100% - 68px);
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
<style lang="less" scoped>
.personnel-management .personnel-management-content {
  overflow: auto;
}
</style>
