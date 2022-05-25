<template>
  <div class="menu-management">
    <a-tabs :default-active-key="activeKey" @change="callback">
      <a-tab-pane v-for="(item, index) in tabs" :key="index">
        <span slot="tab">
          <!-- <a-icon type="apple" /> -->
          {{ item.menuTitle }}
        </span>
      </a-tab-pane>
    </a-tabs>
    <div class="tab-content">
      <div class="management">
        <div class="left-sider">
          <div class="left-sider-btn">
            <a-button class="primary-style" type="primary" style="width: 220px" size="large" @click="add_menu">新建菜单</a-button>
          </div>
          <div class="left-sider-tree">
            <a-tree
              v-if="treeData.length"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'menuTitle',
                key: 'id',
              }"
              :selectedKeys="selectedKeys"
              @select="select_tree"
              :defaultExpandedKeys="expandedRowKeys"
            >
              <template slot="menuTitle" slot-scope="item" style="color: #08c">
                <p class="tree-font">
                  <span class="dot"></span>
                  <span>{{ item.menuTitle }}</span>
                </p>
              </template>
            </a-tree>
          </div>
        </div>
        <div class="management-content" v-if="type == 'add' || type == 'compile'">
          <div class="content-img">
            <img v-if="type == 'add'" src="../../../assets/imgs/addMenu.png" style="width: 114px; height: 114px" alt />
            <img v-if="type == 'compile'" src="../../../assets/imgs/compileMenu.png" style="width: 114px; height: 114px" alt />
          </div>
          <div class="content-form">
            <a-spin :spinning="spinning">
              <a-form-model
                v-if="type == 'add'"
                ref="ruleForm"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="上级菜单" :label-col="{ span: 3 }" prop="parentId">
                  <a-tree-select
                    size="large"
                    v-model="form.parentId"
                    style="width: 370px"
                    :dropdown-style="{
                      maxHeight: '400px',
                      overflow: 'auto',
                    }"
                    :tree-data="treeData"
                    :replaceFields="{
                      children: 'children',
                      title: 'menuTitle',
                      value: 'id',
                      key: 'id',
                    }"
                    placeholder="请选择上级菜单"
                    :treeDefaultExpandAll="true"
                    @change="changeTreeadd"
                  ></a-tree-select>
                </a-form-model-item>
                <a-form-model-item label="类型" :label-col="{ span: 3 }" prop="menuType">
                  <a-radio-group v-model="form.menuType" button-style="solid" @change="changeMenuType" size="large">
                    <a-radio-button :value="1" class="radioStyle">菜单</a-radio-button>
                    <a-radio-button :value="0" class="radioStyle">菜单夹</a-radio-button>
                  </a-radio-group>
                </a-form-model-item>

                <a-form-model-item ref="name" label="菜单名称" :label-col="{ span: 3 }" prop="menuTitle">
                  <a-input size="large" style="width: 370px" placeholder="请输入菜单名称" v-model="form.menuTitle" />
                </a-form-model-item>
                <a-form-model-item ref="name" label="菜单URL" :label-col="{ span: 3 }" prop="menuPath">
                  <a-input size="large" style="width: 370px" placeholder="请输入菜单URL" v-model="form.menuPath" />
                </a-form-model-item>
                <a-form-model-item label="排序号" :label-col="{ span: 3 }" prop="orderNum">
                  <a-input size="large" style="width: 370px" v-model="form.orderNum" placeholder="请输入排序号" />
                </a-form-model-item>
                <a-form-model-item label="未选择图标" :label-col="{ span: 3 }" prop="menuIcon">
                  <a-select size="large" v-model="form.menuIcon" placeholder="请选择图标" option-label-prop="label" style="width: 370px">
                    <a-select-option v-for="item in menuIcon_list" :key="item.id" :label="item.imgUrl" :value="item.imgUrl">
                      <div class="select_style">
                        <div class="icon_style">
                          <img
                            :src="
                              require('@/assets/icon_2/' + item.imgUrl + '.png')
                            "
                            alt
                          />
                        </div>
                        <span :title="form.menuTitle">
                          {{
                          form.menuTitle
                          }}
                        </span>
                      </div>
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="选中时图标" :label-col="{ span: 3 }" prop="menuIconSelect">
                  <a-select size="large" v-model="form.menuIconSelect" placeholder="请选择图标" option-label-prop="label" style="width: 370px">
                    <a-select-option v-for="item in menuIconSelect_list" :key="item.id" :label="item.imgUrl" :value="item.imgUrl">
                      <div class="select_style">
                        <div class="icon_select_style">
                          <img
                            :src="
                              require('@/assets/icon_select_2/' +
                                item.imgUrl +
                                '.png')
                            "
                            alt
                          />
                        </div>

                        <span :title="form.menuTitle">
                          {{
                          form.menuTitle
                          }}
                        </span>
                      </div>
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
                  <div
                    style="
                      width: 370px;
                      display: flex;
                      justify-content: center;
                      padding-top: 57px;
                    "
                  >
                    <a-button class="primary-style" type="primary" size="large" style="width: 220px" @click="onSubmit('add')">保存</a-button>
                  </div>
                </a-form-model-item>
              </a-form-model>
              <a-form-model
                v-if="type == 'compile'"
                ref="ruleForm_compile"
                :model="form"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
              >
                <a-form-model-item label="上级菜单" :label-col="{ span: 3 }" prop="parentId_compile">
                  <a-tree-select
                    size="large"
                    v-model="form.parentId_compile"
                    style="width: 370px"
                    :dropdown-style="{
                      maxHeight: '400px',
                      overflow: 'auto',
                    }"
                    :tree-data="treeData"
                    :replaceFields="{
                      children: 'children',
                      title: 'menuTitle',
                      value: 'id',
                      key: 'id',
                    }"
                    placeholder="请选择上级菜单"
                    :treeDefaultExpandAll="true"
                    :disabled="form_disabled"
                    @change="changeTree"
                  ></a-tree-select>
                </a-form-model-item>
                <a-form-model-item label="类型" :label-col="{ span: 3 }" prop="menuType_compile">
                  <a-radio-group
                    v-model="form.menuType_compile"
                    button-style="solid"
                    size="large"
                    :disabled="form_disabled"
                    @change="changeMenuType_compile"
                  >
                    <a-radio-button :value="1" class="radioStyle">菜单</a-radio-button>
                    <a-radio-button :value="0" class="radioStyle">菜单夹</a-radio-button>
                  </a-radio-group>
                </a-form-model-item>

                <a-form-model-item ref="name" label="菜单名称" :label-col="{ span: 3 }" prop="menuTitle_compile">
                  <a-input
                    size="large"
                    style="width: 370px"
                    placeholder="请输入菜单名称"
                    v-model="form.menuTitle_compile"
                    :disabled="form_disabled"
                  />
                </a-form-model-item>
                <a-form-model-item ref="name" label="菜单URL" :label-col="{ span: 3 }" prop="menuPath_compile">
                  <a-input
                    size="large"
                    style="width: 370px"
                    placeholder="请输入菜单URL"
                    v-model="form.menuPath_compile"
                    :disabled="form_disabled"
                  />
                </a-form-model-item>
                <a-form-model-item label="排序号" :label-col="{ span: 3 }" prop="orderNum_compile">
                  <a-input
                    size="large"
                    style="width: 370px"
                    v-model="form.orderNum_compile"
                    placeholder="请输入排序号"
                    :disabled="form_disabled"
                  />
                </a-form-model-item>
                <a-form-model-item label="未选择图标" :label-col="{ span: 3 }" prop="menuIcon_compile">
                  <a-select
                    size="large"
                    v-model="form.menuIcon_compile"
                    placeholder="请选择图标"
                    option-label-prop="label"
                    style="width: 370px"
                    :disabled="form_disabled"
                  >
                    <a-select-option v-for="item in menuIcon_list" :key="item.id" :label="item.imgUrl" :value="item.imgUrl">
                      <div class="select_style">
                        <div class="icon_style">
                          <img
                            :src="
                              require('@/assets/icon_2/' + item.imgUrl + '.png')
                            "
                            alt
                          />
                        </div>
                        <span :title="form.menuTitle_compile">
                          {{
                          form.menuTitle_compile
                          }}
                        </span>
                      </div>
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="选中时图标" :label-col="{ span: 3 }" prop="menuIconSelect_compile">
                  <a-select
                    size="large"
                    v-model="form.menuIconSelect_compile"
                    placeholder="请选择图标"
                    option-label-prop="label"
                    style="width: 370px"
                    :disabled="form_disabled"
                  >
                    <a-select-option v-for="item in menuIconSelect_list" :key="item.id" :label="item.imgUrl" :value="item.imgUrl">
                      <div class="select_style">
                        <div class="icon_select_style">
                          <img
                            :src="
                              require('@/assets/icon_select_2/' +
                                item.imgUrl +
                                '.png')
                            "
                            alt
                          />
                        </div>

                        <span :title="form.menuTitle_compile">
                          {{
                          form.menuTitle_compile
                          }}
                        </span>
                      </div>
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
                  <div
                    style="
                      width: 370px;
                      display: flex;
                      justify-content: space-between;
                      padding-top: 57px;
                    "
                  >
                    <a-button
                      size="large"
                      class="danger-style"
                      type="danger"
                      style="width: 130px"
                      ghost
                      :disabled="form_disabled"
                      @click="del_visible = true"
                    >删除菜单</a-button>
                    <a-button
                      class="primary-style"
                      type="primary"
                      style="width: 130px"
                      size="large"
                      @click="onSubmit('compile')"
                      :disabled="form_disabled"
                    >保存</a-button>
                  </div>
                </a-form-model-item>
              </a-form-model>
            </a-spin>
          </div>
        </div>
      </div>
    </div>
    <template>
      <a-modal
        v-model="del_visible"
        :closable="false"
        centered
        :bodyStyle="{
          padding: '0px',
          width: '530px',
          height: '274px',
        }"
        wrapClassName="state_dialog"
      >
        <div class="state_content">确认删除该菜单？</div>
        <template slot="footer">
          <div class="footer_btn">
            <span style="color: #ed0000" @click="del_menu">确认删除</span>
          </div>
          <div class="footer_btn">
            <span @click="del_visible = false">取消</span>
          </div>
        </template>
      </a-modal>
    </template>
  </div>
</template>

<script>
import { getroot, getrootTree, saveSysMenus, inquerySysMenus, compileSysMenus, deleteSysMenus, refresh } from '@/services/api_system'
function getBase64(img, callback) {
  console.log(img)
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'menu-management',
  data() {
    return {
      maxSort: 0,
      defaultExpandAllStatus: false,
      treeLevel: 0,
      pid: '',
      level: 0,
      form_disabled: false,
      menuIcon_list: [
        {
          id: 1,
          imgUrl: 'icon_1'
        },
        {
          id: 2,
          imgUrl: 'icon_2'
        },
        {
          id: 3,
          imgUrl: 'icon_3'
        },
        {
          id: 4,
          imgUrl: 'icon_4'
        },
        {
          id: 5,
          imgUrl: 'icon_5'
        },
        {
          id: 6,
          imgUrl: 'icon_6'
        },
        {
          id: 7,
          imgUrl: 'icon_7'
        },
        {
          id: 8,
          imgUrl: 'icon_8'
        },
        {
          id: 9,
          imgUrl: 'icon_9'
        },
        {
          id: 10,
          imgUrl: 'icon_10'
        },
        {
          id: 11,
          imgUrl: 'icon_11'
        },
        {
          id: 12,
          imgUrl: 'icon_12'
        },
        {
          id: 13,
          imgUrl: 'icon_13'
        },
        {
          id: 14,
          imgUrl: 'icon_14'
        },
        {
          id: 15,
          imgUrl: 'icon_15'
        },
        {
          id: 16,
          imgUrl: 'icon_16'
        },
        {
          id: 17,
          imgUrl: 'icon_17'
        },
        {
          id: 18,
          imgUrl: 'icon_18'
        },
        {
          id: 19,
          imgUrl: 'icon_19'
        },
        {
          id: 20,
          imgUrl: 'icon_20'
        },
        {
          id: 21,
          imgUrl: 'icon_21'
        }
      ],
      menuIconSelect_list: [
        {
          id: 1,
          imgUrl: 'icon_select_1'
        },
        {
          id: 2,
          imgUrl: 'icon_select_2'
        },
        {
          id: 3,
          imgUrl: 'icon_select_3'
        },
        {
          id: 4,
          imgUrl: 'icon_select_4'
        },
        {
          id: 5,
          imgUrl: 'icon_select_5'
        },
        {
          id: 6,
          imgUrl: 'icon_select_6'
        },
        {
          id: 7,
          imgUrl: 'icon_select_7'
        },
        {
          id: 8,
          imgUrl: 'icon_select_8'
        },
        {
          id: 9,
          imgUrl: 'icon_select_9'
        },
        {
          id: 10,
          imgUrl: 'icon_select_10'
        },
        {
          id: 11,
          imgUrl: 'icon_select_11'
        },
        {
          id: 12,
          imgUrl: 'icon_select_12'
        },
        {
          id: 13,
          imgUrl: 'icon_select_13'
        },
        {
          id: 14,
          imgUrl: 'icon_select_14'
        },
        {
          id: 15,
          imgUrl: 'icon_select_15'
        },
        {
          id: 16,
          imgUrl: 'icon_select_16'
        },
        {
          id: 17,
          imgUrl: 'icon_select_17'
        },
        {
          id: 18,
          imgUrl: 'icon_select_18'
        },
        {
          id: 19,
          imgUrl: 'icon_select_19'
        },
        {
          id: 20,
          imgUrl: 'icon_select_20'
        },
        {
          id: 21,
          imgUrl: 'icon_select_21'
        }
      ],
      spinning: false,
      del_visible: false,
      activeKey: 0,
      tabs: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      type: '',
      treeData: [],
      selectId: '',
      count: 0,
      expandedRowKeys: [],
      list: [],
      selectedKeys: [], // 选中的节点
      loading: false,
      imageUrl: '',
      form: {
        parentId: undefined,
        menuType: 1,
        menuTitle: '',
        menuPath: '',
        orderNum: '',
        menuIcon: undefined,
        menuIconSelect: undefined,
        parentId_compile: undefined,
        menuType_compile: 1,
        menuTitle_compile: '',
        menuPath_compile: '',
        orderNum_compile: '',
        menuIcon_compile: undefined,
        menuIconSelect_compile: undefined
      },
      rules: {
        parentId: [
          {
            required: true,
            message: '请选择上级菜单',
            trigger: 'change'
          }
        ],
        menuType: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        menuTitle: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '' || value == undefined) {
                cbfn('请输入菜单名称')
              } else if (value.length > 10) {
                cbfn('最多可输入10个字')
              }
              cbfn()
            }
          }
        ],
        menuPath: [
          {
            required: true,
            message: '请输入菜单URL',
            trigger: 'blur'
          }
        ],
        orderNum: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              const reg = /^\+?[1-9]\d{0,3}(\.\d*)?$/
              console.log(value)
              if (value == '' || value == undefined) {
                cbfn('请输入排序号')
              } else if (!reg.test(value) || value.toString().indexOf('.') > -1) {
                cbfn('请输入1-9999的整数')
              }
              cbfn()
            }
          }
        ],
        parentId_compile: [
          {
            required: true,
            message: '请选择上级菜单',
            trigger: 'change'
          }
        ],
        menuType_compile: [
          {
            required: true,
            message: '请选择类型',
            trigger: 'change'
          }
        ],
        menuTitle_compile: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '' || value == undefined) {
                cbfn('请输入菜单名称')
              } else if (value.length > 10) {
                cbfn('最多可输入10个字')
              }
              cbfn()
            }
          }
        ],
        menuPath_compile: [
          {
            required: true,
            message: '请输入菜单URL',
            trigger: 'blur'
          }
        ],
        orderNum_compile: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              const reg = /^\+?[1-9]\d{0,3}(\.\d*)?$/
              if (value == '') {
                cbfn('请输入排序号')
              } else if (!reg.test(value) || value.toString().indexOf('.') > -1) {
                cbfn('请输入1-9999的整数')
              }
              cbfn()
            }
          }
        ]
      }
    }
  },
  components: {},
  created() {
    this.$nextTick(() => {
      this.refreshData()
      this.getrootData()
    })
  },
  mounted() {},
  methods: {
    beforeUpload(file) {
      return false
    },
    changeFile(info) {
      // 上传文件=
      this.loading = true
      getBase64(info.fileList[0].originFileObj, imageUrl => {
        this.imageUrl = imageUrl
        this.loading = false
      })
    },
    // handleChange_icon(item) {
    //   console.log(item);
    //   this.form.menuIcon = item.imgUrl;
    // },
    // handleChange_select_icon(item) {
    //   console.log(item);
    //   this.form.menuIconSelect = item.imgUrl;
    // },
    // handleChange_icon_compile(item) {
    //   // console.log(item);
    //   this.form.menuIcon_compile = item.imgUrl;
    // },
    // handleChange_select_icon_compile(item) {
    //   this.form.menuIconSelect_compile = item.imgUrl;
    // },
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
    /** 加点 展示树形结构 三层 */
    setNode(data, parentId) {
      if (this.pid != parentId) {
        this.level++
      }
      this.pid == parentId
      var num
      for (var i = 0; i < data.length; i++) {
        num = i
        // data[i].parentId = parentId;
        data[i].level = this.level
        if (data[i].children && data[i].children.length > 0) {
          if (this.level <= 2) {
            this.list.push(data[i].id)
          }
          this.setNode(data[i].children, data[i].id)
        } else {
          data[i].scopedSlots = { title: 'menuTitle' }
        }
      }
      if (num === data.length - 1) {
        this.level = data[0].level - 1
      }
      return data
    },
    /** 选择菜单 */
    changeTree(value, label, extra) {
      // console.log(this.form.parentId);
      if (extra.triggerNode.$vnode.data.props.level > 4) {
        this.$message.warning('类型最多只能创建5层!')
        this.form = {
          parentId: undefined
        }
      }
    },
    changeTreeadd(value, label, extra) {
      console.log(value, label, extra)
      this.maxSort = extra.triggerNode.$vnode.data.props.maxSort
      this.form = {
        parentId: this.form.parentId,
        menuType: this.form.menuType,
        menuTitle: this.form.menuTitle,
        menuPath: this.form.menuPath,
        orderNum: this.maxSort + 10,
        menuIcon: this.form.menuIcon,
        menuIconSelect: this.form.menuIconSelect
      }
      this.$refs.ruleForm.clearValidate('orderNum')
    },
    /** 获取菜单树 */
    getrootData() {
      getroot().then(res => {
        // console.log(res);
        if (res.status == 200) {
          this.tabs = res.data
          this.getrootTreeData(this.tabs[this.activeKey])
        }
      })
    },
    /** 根据菜单id获取指定数据 */
    getrootTreeData(tab) {
      // console.log(tab);
      this.defaultExpandAllStatus = false
      this.treeData = []
      getrootTree(tab.id).then(res => {
        console.log(res)
        if (res.status == 200) {
          const list = [
            {
              id: tab.id,
              menuTitle: tab.menuTitle,
              menuType: tab.menuType,
              maxSort: tab.maxSort,
              children: res.data
            }
          ]
          // this.level = 0;
          this.defaultExpandAllStatus = true
          // this.getAllTreeList(list);
          this.setNode(list)
          this.expandedRowKeys = this.list
          this.treeData = list
        }
      })
    },
    /**
     *
     *点击树节点
     */
    select_tree(selectedKeys, { selectedNodes }) {
      console.log(selectedNodes)
      this.treeLevel = selectedNodes[0]?.data.props.level
      this.form_disabled = false
      if (selectedNodes[0].data.props.level == 1) {
        this.form_disabled = true
        this.$message.warning('第一层不可编辑')
      }
      // else {
      this.selectedKeys = selectedKeys
      this.form = {
        parentId: undefined,
        menuType: 1,
        menuTitle: '',
        menuPath: '',
        orderNum: '',
        menuIcon: undefined,
        menuIconSelect: undefined,
        parentId_compile: undefined,
        menuType_compile: 1,
        menuTitle_compile: '',
        menuPath_compile: '',
        orderNum_compile: '',
        menuIcon_compile: undefined,
        menuIconSelect_compile: undefined
      }
      this.maxSort = selectedNodes[0].data.props.maxSort
      if (this.type == 'add') {
        this.$refs.ruleForm.resetFields()
      } else if (this.type == 'compile') {
        this.$refs.ruleForm_compile.resetFields()
      }
      this.type = 'compile'
      this.inquerySysMenusData(selectedKeys[0])
      // }
    },
    changeMenuType(event) {
      // console.log(event.target.value);
      // this.$refs.ruleForm[0].resetFields();
      this.form.menuType = event.target.value
    },
    changeMenuType_compile(event) {
      this.form.menuType_compile = event.target.value
    },
    /** 查询当前菜单的数据 */
    inquerySysMenusData(id) {
      // console.log(id);
      this.spinning = true
      inquerySysMenus(id).then(res => {
        // console.log(res);
        this.spinning = false
        if (res.status == 200) {
          this.form = {
            parentId_compile: res.data.parentId,
            menuType_compile: res.data.menuType,
            menuTitle_compile: res.data.menuTitle,
            menuPath_compile: res.data.menuPath,
            orderNum_compile: res.data.orderNum,
            menuIcon_compile: res.data.menuIcon,
            menuIconSelect_compile: res.data.menuIconSelect
          }
          this.selectId = res.data.id
        }
      })
    },
    /** 点击标签页 */
    callback(key) {
      this.selectedKeys = []
      this.type = ''
      this.activeKey = key
      // console.log(key);
      this.getrootData()
    },
    /** 新建菜单 */
    add_menu() {
      // console.log(this.treeLevel);
      // if (this.selectedKeys.length == 0) {
      if (this.treeLevel > 4) {
        this.$message.warning('类型最多只能创建5层!')
      } else {
        this.type = 'add'
        this.form = {
          menuType: 1,
          menuType_compile: 1,
          parentId: this.selectedKeys[0]
        }
      }
    },
    /** 刷新角色权限缓存 */
    refreshData() {
      // refresh().then((res) => {
      //   // console.log(res, 1111);
      // });
    },
    onSubmit(type) {
      if (type == 'add') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // alert("submit!");
            let component = ''
            let leaf = false
            if (this.form.menuType == 0) {
              component = 'layout'
              leaf = false
              // filePath = "/" + this.form.menuPath.split("/")[1];
            } else {
              component = ''
              leaf = true
              // filePath = this.form.menuPath;
            }
            const params = {
              parentId: this.form.parentId,
              menuType: this.form.menuType,
              menuTitle: this.form.menuTitle,
              menuPath: this.form.menuPath,
              orderNum: this.form.orderNum,
              menuIcon: this.form.menuIcon,
              menuIconSelect: this.form.menuIconSelect,
              component: component,
              filePath: this.form.menuPath,
              leaf: leaf
            }
            saveSysMenus(params).then(res => {
              console.log(res)
              if (res.status === 200) {
                this.$refs.ruleForm.resetFields()
                this.$message.success('保存成功')
                this.refreshData()
                this.getrootTreeData(this.tabs[this.activeKey])
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else if (type == 'compile') {
        this.$refs.ruleForm_compile.validate(valid => {
          if (valid) {
            // console.log(this.form.menuPath_compile);
            let component = ''
            let leaf = false
            if (this.form.menuType_compile == 0) {
              component = 'layout'
              leaf = false
              // filePath = "/" + this.form.menuPath_compile.split("/")[1];
            } else {
              component = ''
              leaf = true
              // filePath = this.form.menuPath_compile;
            }
            // console.log(component);
            const params = {
              id: this.selectId,
              parentId: this.form.parentId_compile,
              menuType: this.form.menuType_compile,
              menuTitle: this.form.menuTitle_compile,
              menuPath: this.form.menuPath_compile,
              orderNum: this.form.orderNum_compile,
              menuIcon: this.form.menuIcon_compile,
              menuIconSelect: this.form.menuIconSelect_compile,
              component: component,
              filePath: this.form.menuPath_compile,
              leaf: leaf
            }
            console.log(params)
            compileSysMenus(this.selectId, params).then(res => {
              // console.log(res);
              if (res.status === 200) {
                this.$message.success('保存成功')
                this.refreshData()
                this.getrootTreeData(this.tabs[this.activeKey])
              }
            })
          } else {
            // console.log("error submit!!");
            return false
          }
        })
      }
    },
    /** 删除 */
    del_menu() {
      // console.log("删除成功");
      deleteSysMenus(this.selectId).then(res => {
        if (res.status == 200) {
          this.del_visible = false
          this.$message.success('删除成功')
          this.selectId = ''
          this.type = ''
          this.selectedKeys = []
          this.refreshData()
          this.getrootTreeData(this.tabs[this.activeKey])
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.menu-management {
  height: 100%;
  background: #fff;
  box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
  .ant-tabs {
    padding: 0 23px;
    // height: 100%;
  }
  .tab-content {
    padding-top: 5px;
    height: calc(100% - 60px);
    position: relative;
    overflow: auto;
    .ant-tree {
      overflow: auto;
      max-width: 180px;
      height: 100%;
    }
    .management {
      height: 100%;
      background: #fff;
      // box-shadow: 0px 1px 10px 0px rgba(204, 204, 204, 0.5);
      display: flex;
      .left-sider {
        height: calc(100% - 22px);
        margin-left: 20px;
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
          height: calc(100% - 62px);
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
      .management-content {
        flex: 1;
        height: 100%;
        padding-top: 62px;
        margin-left: 41px;
        overflow: auto;
        .content-img {
          padding-left: 29px;
          padding-bottom: 20px;
          float: left;
          height: 100%;
        }
        .content-form {
          margin-left: 170px;
          padding-bottom: 20px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
.select_style {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon_style {
    background: #000;
  }
  .icon_select_style {
    background: #fff;
  }
  .icon_style,
  .icon_select_style {
    width: 25px;
    height: 25px;
    text-align: center;
    vertical-align: middle;
    img {
      width: 20px;
      height: 20px;
    }
  }

  span {
    display: inline-block;
    text-align: right;
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #ccc;
  }
}
/deep/.avatar-uploader {
  .ant-upload {
    width: 102px;
    height: 102px;
  }
}
/deep/.ant-modal {
  width: 530px !important;
  height: 350px;
  .state_content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 26px;
    font-weight: 400;
    color: #000000;
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
