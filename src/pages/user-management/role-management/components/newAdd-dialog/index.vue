<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
    :maskClosable="false"
  >
    <div class="header">
      <span>新建角色</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <div class="model-form">
            <div class="model-form-header">
              <span></span>
              <span>基础信息</span>
            </div>
            <div class="model-form-content">
              <a-form-model-item label="角色名称" :label-col="{ span: 4 }" prop="role_name">
                <a-input size="large" v-model="form.role_name" placeholder="请输入角色名称" />
              </a-form-model-item>
              <a-form-model-item label="系统权限" :label-col="{ span: 4 }" prop="system_permissions">
                <a-select
                  size="large"
                  v-model="form.system_permissions"
                  mode="multiple"
                  placeholder="请选择系统权限"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  option-label-prop="label"
                  :labelInValue="true"
                  @change="handleSelect_system"
                >
                  <a-select-option
                    v-for="item in system_permissions_list"
                    :key="item.id"
                    :value="item.id"
                    :label="item.menuTitle"
                  >{{ item.menuTitle }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="数据权限" prop="data_permissions">
                <a-select size="large" v-model="form.data_permissions" placeholder="请选择数据权限" @change="changeData_permissions">
                  <a-select-option v-for="item in data_permissions_list" :key="item.id" :value="item.id">{{ item.label }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="组织范围" v-if="form.data_permissions == 4" prop="organization_wide">
                <a-tree-select
                  size="large"
                  v-model="form.organization_wide"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="organization_treeData"
                  :replaceFields="{
                    children: 'children',
                    title: 'deptName',
                    value: 'id',
                    key: 'id',
                  }"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  placeholder="请选择组织范围"
                  :treeDefaultExpandedKeys="organization_expandedRowKeys"
                ></a-tree-select>
              </a-form-model-item>
              <a-form-model-item label="角色描述" prop="role_desc">
                <a-input v-model="form.role_desc" type="textarea" />
              </a-form-model-item>
            </div>
            <div
              v-if="tabs.length == 0"
              style="
                display: flex;
                justify-content: flex-end;
                padding-top: 26px;
              "
            >
              <a-button class="cancel-style" @click="onClose" style="margin-right: 20px">取消</a-button>
              <a-button class="primary-style" type="primary" @click="onSubmit">保存</a-button>
            </div>
          </div>
          <div class="model-form" v-if="tabs.length > 0">
            <div class="model-form-header">
              <span></span>
              <span>菜单权限</span>
            </div>
            <div class="model-form-content">
              <a-tabs :activeKey="activeKey" @change="change_tab">
                <a-tab-pane v-for="tree_obj in tabs" :key="tree_obj.key">
                  <span slot="tab">
                    <!-- <a-icon type="apple" /> -->
                    {{ tree_obj.label }}
                  </span>
                  <div class="tab-content">
                    <a-tree
                      checkable
                      v-if="treeData.length"
                      :tree-data="treeData"
                      :replaceFields="{
                        children: 'children',
                        title: 'menuTitle',
                        key: 'id',
                      }"
                      :defaultCheckedKeys="defaultSelectedKeys"
                      :defaultExpandAll="true"
                      @check="onCheck"
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
            <div
              style="
                display: flex;
                justify-content: flex-end;
                padding-top: 26px;
              "
            >
              <a-button class="cancel-style" @click="onClose" style="margin-right: 20px">取消</a-button>
              <a-button class="primary-style" type="primary" @click="onSubmit">保存</a-button>
            </div>
          </div>
        </a-form-model>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { getroot, getrootTree, getrootAllTree } from '@/services/api_system'
import { getBaseDepts, postSysRoles, postSysRoleAuthorizations, postBaseDataAuthorization } from '@/services/api_user'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  data() {
    return {
      SHOW_PARENT,
      activeKey: '',
      data_permissions_list: [
        {
          id: 0,
          label: '查看本人'
        },
        {
          id: 1,
          label: '查看本组织'
        },
        {
          id: 2,
          label: '查看本组织及下级组织'
        },
        {
          id: 3,
          label: '查看所有'
        },
        {
          id: 4,
          label: '自定义组织范围'
        }
      ],
      selectedKeys: [],
      defaultSelectedKeys: [],
      organization_count: 0,
      organization_list: [],
      system_permissions_list: [],
      organization_treeData: [],
      organization_expandedRowKeys: [], // 控制展开几层
      tabs: [],
      treeData: [],
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        role_name: '',
        data_permissions: '',
        system_permissions: undefined,
        organization_wide: [],
        role_desc: ''
      },
      rules: {
        role_name: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '' || value == undefined) {
                cbfn('请输入角色名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        data_permissions: [
          {
            required: true,
            message: '请选择数据权限',
            trigger: 'change'
          }
        ],
        system_permissions: [
          {
            required: true,
            message: '请选择系统权限',
            trigger: 'change'
          }
        ],
        organization_wide: [
          {
            required: true,
            message: '请选择组织范围',
            trigger: 'change'
          }
        ],
        role_desc: [
          {
            max: 100,
            message: '最多可输入100个字'
          }
        ]
      }
    }
  },
  methods: {
    /** 展示树形结构 三层 */
    getAllTreeList(list) {
      list.map(item => {
        console.log(item)
        if (item.parentId == 'root') {
          this.organization_count = 0
        }
        if (this.organization_count <= 2) {
          if (this.organization_list.length == 0) {
            this.organization_list.push(item.id)
          } else {
            this.organization_list.forEach((obj, index) => {
              if (obj == item.id) {
                this.organization_list.splice(index, 1)
              }
            })
            this.organization_list.push(item.id)
          }
        }
        if (item.hasOwnProperty('children') && item.children.length > 0) {
          this.organization_count++
          this.getAllTreeList(item.children)
        }
        if (item.children.length == 0 && item.parentId !== 'root') {
          item.scopedSlots = { title: 'deptName' }
        }
        return item
      })
    },
    changeData_permissions(value) {
      // console.log(value, this.form.data_permissions);
      if (value !== 4) {
        this.form.organization_wide = []
      }
    },
    /** 切换标签 */
    change_tab(activeKey) {
      // console.log(activeKey);
      this.activeKey = activeKey
      this.defaultSelectedKeys = []
      this.getrootTreeData(this.activeKey)
    },
    /** 选中当前得菜单复选框 */
    onCheck(checkedKeys, info) {
      // console.log(checkedKeys, info);
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.activeKey == this.tabs[i].key) {
          this.tabs[i].checkedKeys = checkedKeys
        }
      }
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        this.form.data_permissions = 0
        this.getrootData()
        this.getBaseDeptsData()
        // this.getrootAllTreeData();
      }
    },
    // getrootAllTreeData() {
    //   getrootAllTree().then((res) => {
    //     console.log(111111111111111, res);
    //   });
    // },
    /** 获取系统列表 */
    getrootData() {
      getroot().then(res => {
        // console.log(res);
        if (res.status == 200) {
          this.system_permissions_list = res.data
        }
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
    /** 根据菜单id获取指定数据 */
    getrootTreeData(id) {
      this.treeData = []
      getrootTree(id).then(res => {
        // console.log(res);
        if (res.status == 200) {
          this.getAllTreeLists(res.data)
          this.treeData = res.data
          for (let i = 0; i < this.tabs.length; i++) {
            if (this.activeKey == this.tabs[i].key) {
              if (this.tabs[i].checkedKeys === undefined) {
                this.tabs[i].checkedKeys = []
              } else {
                if (this.tabs[i].checkedKeys.length > 0) {
                  this.defaultSelectedKeys = this.tabs[i].checkedKeys
                }
              }
            }
          }
        }
      })
    },
    /** 选择系统权限 */
    handleSelect_system(value) {
      // console.log(this.activeKey);
      const _list = JSON.parse(JSON.stringify(value))
      const _tabs = JSON.parse(JSON.stringify(this.tabs))
      let newArr = []
      if (_list.length > 0) {
        if (_tabs.length > 0) {
          for (let i = 0; i < _list.length; i++) {
            _list[i].checkedKeys = []
            for (let j = 0; j < _tabs.length; j++) {
              if (_list[i].key === _tabs[j].key) {
                _list[i].checkedKeys = _tabs[j].checkedKeys
              }
            }
          }
          newArr = _list
        } else {
          newArr = _list
        }
      } else {
        newArr = []
      }
      console.log(newArr)
      this.tabs = newArr
      // this.activeKey = this.tabs[0].key;
      if (this.tabs.length > 0) {
        // for (let i = 0; i < this.tabs.length; i++) {
        //   // console.log(this.tabs[i]["checkedKeys"]);
        //   this.tabs[i]["checkedKeys"] = [];
        // }
        // this.getrootTreeData(this.activeKey);
        this.change_tab(this.tabs[0].key)
      } else {
        this.treeData = []
        this.defaultSelectedKeys = []
        this.activeKey = ''
      }
    },
    /** 获取组织范围 */
    async getBaseDeptsData() {
      const { data, status } = await getBaseDepts({ userCount: false })
      // console.log(data, status);
      if (status === 200) {
        this.getAllTreeList(data)
        this.organization_expandedRowKeys = this.organization_list
        this.organization_treeData = data
      }
    },
    onClose() {
      this.tabs = []
      this.form.role_name = ''
      this.form.role_desc = ''
      this.form.system_permissions = undefined
      this.form.data_permissions = undefined
      this.form.organization_wide = []
      this.$refs.ruleForm.clearValidate()
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const list = []
          for (let i = 0; i < this.form.system_permissions.length; i++) {
            list.push(this.form.system_permissions[i].key)
          }
          // console.log(list);
          const array = []
          for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].checkedKeys !== undefined) {
              list.concat(this.tabs[i].checkedKeys)
              for (let j = 0; j < this.tabs[i].checkedKeys.length; j++) {
                array.push(this.tabs[i].checkedKeys[j])
              }
            }
          }
          if (array.length == 0) {
            this.$message.warning('请至少选择一个菜单权限')
            return
          }
          const params = {
            roleName: this.form.role_name,
            systemList: list,
            // roleCode: "code",
            description: this.form.role_desc
          }
          // console.log(params);
          postSysRoles(params).then(res => {
            // console.log(res);
            if (res.status == 200) {
              this.postSysRoleAuthorizationsData(res.data)
              this.postBaseDataAuthorizationData(res.data)
              this.$nextTick(() => {
                this.$message.success('保存成功')
                this.onClose()
                this.$emit('refresh')
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    postSysRoleAuthorizationsData(data) {
      // console.log(data);
      const list = []
      // console.log(this.tabs);
      for (let i = 0; i < this.tabs.length; i++) {
        list.concat(this.tabs[i].checkedKeys)
        for (let j = 0; j < this.tabs[i].checkedKeys.length; j++) {
          list.push(this.tabs[i].checkedKeys[j])
        }
      }
      postSysRoleAuthorizations(data.id, {
        resourceIds: list,
        resourceType: 0
      }).then(res => {
        console.log(res)
      })
    },
    postBaseDataAuthorizationData(data) {
      postBaseDataAuthorization(data.id, {
        resourceIds: this.form.organization_wide,
        type: this.form.data_permissions
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.dialog {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  /deep/.ant-drawer-content-wrapper {
    max-width: 620px;
    height: auto !important;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-content {
      background-color: #f5f4f4;
      .ant-drawer-body {
        height: 100%;
        padding: 0;
        .header {
          position: relative;
          max-width: 620px;
          height: 67px;
          line-height: 67px;
          background: @theme-color;
          box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
          padding-left: 20px;
          text-align: left;
          span {
            font-size: 22px;
            font-weight: 500;
            color: #ffffff;
          }
          i {
            position: absolute;
            top: 29px;
            right: 20px;
            font-size: 15px;
            color: #fff;
            cursor: pointer;
          }
        }
        .footer {
          max-height: 863px;
          background: #f5f4f4;
          padding: 0 20px;
          overflow: auto;
          .model {
            .model-form {
              margin-bottom: 11px;
              .model-form-header {
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
              .model-form-content {
                background: #fff;
                padding: 24px 0 24px 20px;
                border-radius: 5px;
                box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
                .ant-form-item {
                  .ant-form-item-control {
                    width: 438px !important;
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
  }
}
</style>
