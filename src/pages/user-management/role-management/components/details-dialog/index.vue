<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    :visible="visible"
    width="620"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog-right"
  >
    <div class="header">
      <div class="header-title">
        <span v-if="item">{{ item.roleName }}</span>
        <a-icon type="close" @click="onClose" />
      </div>
      <div class="header-btn" v-if="item">
        <a
          v-if="
            item.id !== '7d6a7f658c214a719bf2903aa1853f83' &&
            item.id !== '27b4207cbf4840c7afc9787bf4e336e5' &&
            item.id !== '84c1cece1abf49bd800d5adcf4c1c42a'
          "
          @click="compile"
        >
          <a-icon type="edit" style="fontSize:20px;padding-right: 5px;" />编辑
        </a>
        <a
          v-if="
            item.id !== '7d6a7f658c214a719bf2903aa1853f83' &&
            item.id !== '27b4207cbf4840c7afc9787bf4e336e5' &&
            item.id !== '84c1cece1abf49bd800d5adcf4c1c42a'
          "
          @click="del_visible = true"
        >
          <a-icon type="delete" style="fontSize:20px;padding-right: 5px;" />删除
        </a>
        <a
          v-if="
            item.id !== '7d6a7f658c214a719bf2903aa1853f83' &&
            item.id !== '27b4207cbf4840c7afc9787bf4e336e5' &&
            item.id !== '84c1cece1abf49bd800d5adcf4c1c42a'
          "
          @click="maintenanceMembers"
        >
          <a-icon type="user" style="fontSize:20px;padding-right: 5px;" />维护成员
        </a>
      </div>
    </div>
    <div class="footer">
      <div class="footer-title">
        <div class="footer-title-header">
          <span></span>
          <span>基础信息</span>
        </div>
        <div class="footer-title-model">
          <a-descriptions :column="1">
            <a-descriptions-item label="系统权限">
              <span v-if="system_permissions.length">
                <span v-for="(item, index) in system_permissions" :key="index">
                  {{ item.label
                  }}{{
                  index + 1 == system_permissions.length ? "" : "，"
                  }}
                </span>
              </span>
              <span v-else>暂无权限</span>
            </a-descriptions-item>
            <a-descriptions-item label="数据权限">
              <span v-if="data_permissions == 0">查看本人</span>
              <span v-if="data_permissions == 1">查看本组织</span>
              <span v-if="data_permissions == 2">查看本组织及下级组织</span>
              <span v-if="data_permissions == 3">查看所有</span>
              <span v-if="data_permissions == 4">自定义组织范围</span>
            </a-descriptions-item>
            <a-descriptions-item label="角色描述">
              <span v-if="item">{{ item.description }}</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
      <div class="footer-title" v-if="system_permissions.length">
        <div class="footer-title-header">
          <span></span>
          <span>菜单权限</span>
        </div>
        <div class="footer-title-model">
          <a-tabs :default-active-key="activeKey" @change="change_tab">
            <a-tab-pane v-for="tree_obj in tabs" :key="tree_obj.key">
              <span slot="tab">
                <!-- <a-icon type="apple" /> -->
                {{ tree_obj.label }}
              </span>
              <div class="tab-content">
                <a-tree
                  :disabled="true"
                  checkable
                  v-if="treeData.length"
                  :tree-data="treeData"
                  :replaceFields="{
                    children: 'children',
                    title: 'menuTitle',
                    key: 'id',
                  }"
                  :defaultCheckedKeys="defaultSelectedKeys"
                  :defaultExpandAll="defaultExpandAllStatus"
                >
                  <template slot="title" slot-scope="item" style="color: #08c">
                    <p class="tree-font">
                      <span class="dot"></span>
                      <span>{{ item.menuTitle }}</span>
                    </p>
                  </template>
                </a-tree>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <template v-if="item">
      <a-modal
        v-model="del_visible"
        :closable="false"
        centered
        :bodyStyle="{
          padding: '0px',
          width: '530px',
          height: '274px',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          overflow: 'auto',
        }"
        wrapClassName="state_dialog"
      >
        <div class="state_content" v-if="item.members.length == 0">确认删除该角色？</div>
        <div class="state_content" v-else>
          <span>该角色绑定以下成员,请谨慎删除</span>
          <span v-for="(obj, ind) in item.members" :key="ind">{{ obj.name }}{{ ind + 1 == item.members.length ? "" : "，" }}</span>
        </div>
        <template slot="footer">
          <div class="footer_btn">
            <span v-if="item.members.length == 0" style="color: #ed0000" @click="delData">确认删除</span>
            <span v-else style="color: #ed0000" @click="delData">解绑,并删除</span>
          </div>
          <div class="footer_btn">
            <span @click="del_visible = false">取消</span>
          </div>
        </template>
      </a-modal>
    </template>
  </a-drawer>
</template>
<script>
import { getroot, getrootTree } from '@/services/api_system'
import { getSysRoleAuthorizations, getBaseDataAuthorization, deleteSysRoles } from '@/services/api_user'
export default {
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      defaultExpandAllStatus: false,
      list: [],
      visible: false,
      del_visible: false,
      data_permissions: '',
      system_permissions: [],
      system_permissions_list: [],
      activeKey: '',
      tabs: [],
      treeData: [],
      defaultSelectedKeys: [],
      checkedKeysList: []
    }
  },
  methods: {
    compile() {
      this.visible = false
      this.$parent.compile(this.item)
    },
    maintenanceMembers() {
      this.visible = false
      this.$parent.maintenanceMembers(this.item)
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        console.log(this.item)
        this.getrootData()
        this.getBaseDataAuthorizationData()
        // this.$nextTick(() => {

        //   this.getSysRoleAuthorizationsData();
        // }, 800);
      }
    },
    /** 获取系统列表 */
    getrootData() {
      getroot().then(res => {
        // console.log(res, 2);
        if (res.status == 200) {
          // console.log(res)
          this.system_permissions_list = res.data
          const list = []
          for (let i = 0; i < this.item.systemList.length; i++) {
            for (let j = 0; j < this.system_permissions_list.length; j++) {
              if (this.item.systemList[i] == this.system_permissions_list[j].id) {
                list.push({
                  key: this.system_permissions_list[j].id,
                  label: this.system_permissions_list[j].menuTitle
                })
              }
            }
          }
          // console.log(list);
          if (list.length == 0) {
            this.system_permissions = []
          } else {
            this.system_permissions = list
            this.getSysRoleAuthorizationsData()
          }
        }
      })
    },
    /** 切换标签 */
    change_tab(activeKey) {
      // console.log(activeKey);
      this.activeKey = activeKey
      this.defaultSelectedKeys = []
      this.getrootTreeData(this.activeKey)
    },
    getSysRoleAuthorizationsData() {
      getSysRoleAuthorizations(this.item.id).then(res => {
        console.log(res, 1)
        this.checkedKeysList = res.data
        this.handleSelect_system(this.system_permissions)
      })
    },
    /** 展示树形结构 三层 */
    getAllTreeLists(list) {
      list.map(item => {
        if (item.hasOwnProperty('children') && item.children.length > 0) {
          this.getAllTreeLists(item.children)
        }
        if (item.children.length == 0) {
          item.scopedSlots = { title: 'menuTitle' }
        }
        return item
      })
    },
    /** 选择系统权限 */
    handleSelect_system(value) {
      this.tabs = value
      console.log(this.activeKey, this.tabs)
      if (this.tabs.length > 0) {
        this.activeKey = this.tabs[0].key
        for (let i = 0; i < this.tabs.length; i++) {
          this.tabs[i].checkedKeys = []
          if (this.checkedKeysList.length > 0) {
            for (let j = 0; j < this.checkedKeysList.length; j++) {
              if (this.tabs[i].key == this.checkedKeysList[j].rootId) {
                this.tabs[i].checkedKeys = this.checkedKeysList[j].ids
              }
            }
          }
        }
        this.checkedKeysList = []
        this.getrootTreeData(this.activeKey)
      } else {
        this.treeData = []
        this.defaultSelectedKeys = []
        this.activeKey = ''
      }
    },
    /** 根据菜单id获取指定数据 */
    getrootTreeData(id) {
      this.treeData = []
      this.defaultExpandAllStatus = false
      getrootTree(id).then(res => {
        console.log(res)
        if (res.status == 200) {
          this.getAllTreeLists(res.data)
          this.defaultExpandAllStatus = true
          this.treeData = res.data
          for (let i = 0; i < this.tabs.length; i++) {
            if (this.activeKey == this.tabs[i].key) {
              if (this.tabs[i].checkedKeys.length > 0) {
                this.defaultSelectedKeys = this.tabs[i].checkedKeys
              }
            }
          }
        }
      })
    },
    getBaseDataAuthorizationData() {
      getBaseDataAuthorization(this.item.id).then(res => {
        // console.log(res);
        if (res.status == 200) {
          if (res.data.length > 0) {
            let type = res.data[0].type
            switch (type) {
              case '查看本人':
                type = 0
                break
              case '查看本组织':
                type = 1
                break
              case '查看本组织及下级组织':
                type = 2
                break
              case '查看所有':
                type = 3
                break
              case '自定义组织范围':
                type = 4
                break
              default:
                break
            }
            this.data_permissions = type
          }
        }
      })
    },
    delData() {
      // console.log(删除);
      deleteSysRoles(this.item.id).then(res => {
        if (res.status == 200) {
          this.visible = false
          this.del_visible = false
          this.$message.success('删除成功')
          this.$emit('refresh')
        }
      })
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialog-right {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /deep/.ant-drawer-content-wrapper {
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        padding: 20px;
        height: 100px;
        background: @theme-color;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px;
        .header-title {
          position: relative;
          height: 20px;

          span {
            font-size: 20px;
            font-weight: 500;
            color: #ffffff;
            line-height: 20px;
          }
          i {
            position: absolute;
            top: 5px;
            right: -5px;
            color: #ffffff;
            font-size: 15px;
          }
        }
        .header-btn {
          height: 20px;
          display: flex;
          justify-content: flex-start;
          align-content: center;
          a {
            margin-right: 56px;
            font-size: 16px;
            font-weight: 400;
            color: #ffffff;
            img {
              width: 20px;
              height: 20px;
              vertical-align: text-top;
            }
          }
        }
      }
      .footer {
        height: calc(100% - 100px);
        background: #f5f4f4;
        padding: 0 20px 20px 20px;
        overflow: auto;
        .footer-title {
          .footer-title-header {
            margin-top: 21px;
            margin-bottom: 11px;
            height: 20px;
            span:first-child {
              display: inline-block;
              width: 5px;
              height: 20px;
              background: @theme-color;
              margin-right: 15px;
            }
            span:last-child {
              height: 20px;
              line-height: 20px;
              font-size: 18px;
              font-weight: 500;
              color: #818181;
              vertical-align: top;
            }
          }
          .footer-title-model {
            background: #ffffff;
            box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
            border-radius: 3px;
            padding-top: 37px;
            padding-bottom: 12px;
            padding-left: 25px;
            padding-right: 20px;
            .ant-descriptions-row > td {
              padding-bottom: 30px !important;
              .ant-descriptions-item-content {
                font-size: 16px;
                font-weight: 600;
                color: #000000;
              }
            }
            .ant-tabs {
              .ant-tabs-content {
                padding-top: 5px;
                .tab-content {
                  position: relative;
                  overflow: auto;
                  .ant-tree {
                    overflow: auto;
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
                        color: rgba(0, 0, 0, 0.65);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-modal {
  width: 530px !important;
  height: 350px;
  .state_content {
    // height: 100%;
    padding: 0 30px;
    font-size: 26px;
    color: #000000;
    // width: 100%;
    // height: 100%;
    span:first-child {
      text-indent: 52px;
      display: inline-block;
      width: 100%;
      font-weight: 400;
    }
    span {
      font-weight: bold;
    }
  }
}
/deep/.ant-modal-footer {
  overflow: hidden;
  padding: 0;
  .footer_btn {
    width: 260px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    float: left;
    span {
      cursor: pointer;
      font-size: 18px;
      font-weight: 400;
    }
  }
  .footer_btn:first-child {
    border-right: 1px solid #f2f2f2;
  }
}
</style>
