<template>
  <div class="organization-management">
    <div class="left-sider">
      <div class="left-sider-btn">
        <a-button class="primary-style" type="primary" style="width: 220px" size="large" @click="add_organization">新建组织</a-button>
      </div>
      <div class="left-sider-tree">
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
              <span>{{ item.deptName }}</span>
            </p>
          </template>
        </a-tree>
      </div>
    </div>
    <div class="organization-management-content" v-if="type == 'add' || type == 'compile'">
      <div class="content-img">
        <img v-if="type == 'add'" src="../../../assets/imgs/newAdd.png" style="width: 114px; height: 114px" alt />
        <img v-if="type == 'compile'" src="../../../assets/imgs/compile.png" style="width: 114px; height: 114px" alt />
      </div>
      <div class="content-form">
        <a-form-model v-if="type == 'add'" ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="上级组织" :label-col="{ span: 3 }" prop="organization">
            <a-tree-select
              size="large"
              v-model="form.organization"
              style="width: 370px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'deptName',
                value: 'id',
                key: 'id',
              }"
              placeholder="请选择上级组织"
              :treeDefaultExpandedKeys="expandedRowKeys"
              @change="changeTreeadd"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="组织名称" :label-col="{ span: 3 }" prop="organization_name">
            <a-input size="large" style="width: 370px" placeholder="请输入组织名称" v-model="form.organization_name" />
          </a-form-model-item>
          <a-form-model-item label="排序号" :label-col="{ span: 3 }" prop="sort">
            <a-input size="large" style="width: 370px" v-model="form.sort" placeholder="请输入排序号" />
          </a-form-model-item>
          <a-form-model-item label="组织描述" :label-col="{ span: 3 }" prop="organization_desc">
            <a-input
              size="large"
              v-model="form.organization_desc"
              style="width: 370px; font-size: 16px"
              type="textarea"
              placeholder="请输入组织描述"
            />
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
              <a-button class="primary-style" type="primary" style="width: 220px" size="large" @click="onSubmit('add')">保存</a-button>
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
          <a-form-model-item label="上级组织" :label-col="{ span: 3 }" prop="organization_compile">
            <a-tree-select
              size="large"
              v-model="form.organization_compile"
              style="width: 370px"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'deptName',
                value: 'id',
                key: 'id',
              }"
              :disabled="form_disabled"
              placeholder="请选择上级组织"
              :treeDefaultExpandedKeys="expandedRowKeys"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item ref="name" label="组织名称" :label-col="{ span: 3 }" prop="organization_name_compile">
            <a-input
              size="large"
              style="width: 370px"
              placeholder="请输入组织名称"
              v-model="form.organization_name_compile"
              :disabled="form_disabled"
            />
          </a-form-model-item>
          <a-form-model-item label="排序号" :label-col="{ span: 3 }" prop="sort_compile">
            <a-input size="large" style="width: 370px" v-model="form.sort_compile" :disabled="form_disabled" placeholder="请输入排序号" />
          </a-form-model-item>
          <a-form-model-item label="组织描述" :label-col="{ span: 3 }" prop="organization_desc_compile">
            <a-input
              size="large"
              style="width: 370px; font-size: 16px"
              v-model="form.organization_desc_compile"
              type="textarea"
              placeholder="请输入组织描述"
              :disabled="form_disabled"
            />
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
                type="danger"
                ghost
                class="danger-style"
                style="width: 130px"
                @click="del_organization"
                :disabled="form_disabled"
              >删除组织</a-button>
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
      </div>
    </div>
    <template>
      <Del_dialog ref="del_dialog" :id="selectId" @refresh="refresh" />
    </template>
  </div>
</template>

<script>
import Del_dialog from './components/del_dialog'
import { getBaseDepts, addBaseDepts, inqueryBaseDepts, updateBaseDepts } from '../../../services/api_user'
export default {
  data() {
    return {
      maxSort: 0,
      treeLevel: 0,
      pid: '',
      level: 0,
      form_disabled: false,
      type: '',
      treeData: [],
      expandedRowKeys: [], // 控制展开几层
      selectId: '',
      count: 0,
      selectedKeys: [], // 选中的节点
      list: [],
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: '',
      form: {
        organization: undefined,
        organization_name: '',
        sort: '',
        organization_desc: '',
        organization_compile: undefined,
        organization_name_compile: '',
        sort_compile: '',
        organization_desc_compile: ''
      },
      rules: {
        organization: [
          {
            required: true,
            message: '请选择上级组织',
            trigger: 'change'
          }
        ],
        organization_name: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '' || value == undefined) {
                cbfn('请输入组织名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        sort: [
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
        ],
        organization_desc: [
          {
            max: 100,
            message: '最多可输入100个字'
          }
        ],
        organization_compile: [
          {
            required: true,
            message: '请选择上级组织',
            trigger: 'change'
          }
        ],
        organization_name_compile: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '' || value == undefined) {
                cbfn('请输入组织名称')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        sort_compile: [
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
        ],
        organization_desc_compile: [
          {
            max: 100,
            message: '最多可输入100个字'
          }
        ]
      }
    }
  },
  components: {
    Del_dialog
  },
  created() {},
  mounted() {
    this.getBaseDeptsData()
  },
  methods: {
    /** 选择菜单 */
    changeTreeadd(value, label, extra) {
      this.maxSort = extra.triggerNode.$vnode.data.props.maxSort
      this.form.sort = this.maxSort + 10
      if (extra.triggerNode.$vnode.data.props.level > 4) {
        this.$message.warning('类型最多只能创建5层!')
        this.form = {
          organization: undefined
        }
      }
    },
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
        data[i].level = this.level
        // console.log(this.level, "!!!!!!!!!!", data[i]);
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
        // console.log(this.level, data);
        this.level = data[0].level - 1
      }
      return data
    },
    /** 获取组织树 */
    async getBaseDeptsData() {
      const { data, status } = await getBaseDepts({ userCount: false })
      // console.log(data, status);
      if (status === 200) {
        // this.count = 0;
        this.setNode(data)
        // this.getAllTreeList(data);
        console.log(this.list)
        this.expandedRowKeys = this.list
        // console.log(data);
        this.treeData = data
      }
    },
    /**
     *
     *点击树节点
     */
    select_tree(selectedKeys, { selectedNodes }) {
      console.log(selectedKeys, selectedNodes)
      if (selectedNodes.length == 0) {
        this.type = ''
        this.treeLevel = 0
        this.selectedKeys = []
      } else {
        this.treeLevel = selectedNodes[0]?.data.props.level
        this.form_disabled = false
        if (selectedNodes[0].data.props.level == 1) {
          this.form_disabled = true
          this.$message.warning('第一层不可编辑')
        }
        this.selectedKeys = selectedKeys
        this.maxSort = selectedNodes[0].data.props.maxSort
        if (this.type == 'add') {
          this.$refs.ruleForm.resetFields()
        }
        this.type = 'compile'
        this.inqueryBaseDeptsData(selectedKeys[0])
      }
    },
    /** 添加组织 */
    add_organization() {
      if (this.treeLevel > 4) {
        this.$message.warning('类型最多只能创建5层!')
      } else {
        if (this.type == 'compile') {
          this.$refs.ruleForm_compile.resetFields()
          this.form.organization_desc_compile = ''
        }
        this.type = 'add'
        console.log(this.selectedKeys)
        this.form = {
          organization: this.selectedKeys.length > 0 ? this.selectedKeys[0] : undefined,
          sort: this.selectedKeys.length > 0 ? this.maxSort + 10 : ''
        }
      }
    },
    /** 查询当前组织的数据 */
    inqueryBaseDeptsData(id) {
      inqueryBaseDepts(id).then(res => {
        // console.log(res);
        if (res.status == 200) {
          this.form = {
            organization_compile: res.data.parentId,
            organization_name_compile: res.data.deptName,
            sort_compile: res.data.sort,
            organization_desc_compile: res.data.description
          }
          this.selectId = res.data.id
          // console.log(this.form);
        }
      })
    },
    onSubmit(type) {
      if (type == 'add') {
        console.log(11)
        this.$refs.ruleForm.validate(valid => {
          console.log(22)
          if (valid) {
            // console.log(this.form);
            const params = {
              parentId: this.form.organization,
              // deptCode: this.form.organization_name,
              deptName: this.form.organization_name,
              sort: this.form.sort,
              description: this.form.organization_desc
            }
            // console.log(params);
            addBaseDepts(params).then(res => {
              // console.log(res);
              if (res.status === 200) {
                this.$refs.ruleForm.resetFields()
                this.$message.success('保存成功')
                this.getBaseDeptsData()
              }
            })
          } else {
            // console.log("error submit!!");
            return false
          }
        })
      } else if (type == 'compile') {
        this.$refs.ruleForm_compile.validate(valid => {
          if (valid) {
            const params = {
              id: this.selectId,
              parentId: this.form.organization_compile,
              // deptCode: this.form.organization_name_compile,
              deptName: this.form.organization_name_compile,
              sort: this.form.sort_compile,
              description: this.form.organization_desc_compile
            }
            // console.log(params);
            updateBaseDepts(this.selectId, params).then(res => {
              console.log(res)
              if (res.status === 200) {
                this.$message.success('保存成功')
                this.getBaseDeptsData()
              }
            })
          } else {
            // console.log("error submit!!");
            return false
          }
        })
      }
    },
    /** 当删除组织时还原页面状态 */
    refresh() {
      this.selectId = ''
      this.type = ''
      this.selectedKeys = []
      this.getBaseDeptsData()
    },
    /**
     * 删除组织
     */
    del_organization() {
      // console.log("删除组织");
      this.$refs.del_dialog.visible = true
    }
  }
}
</script>

<style lang="less" scoped >
.organization-management {
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
          // color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
  .organization-management-content {
    flex: 1;
    height: 100%;
    padding-top: 82px;
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
.ant-tree {
  overflow: auto;
  max-width: 180px;
  height: 100%;
}
</style>
