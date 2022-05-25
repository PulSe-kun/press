<template>
  <a-drawer :closable="false" placement="top" :visible="visible" :after-visible-change="afterVisibleChange" wrapClassName="dialog">
    <div class="header">
      <span>新建人员</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="账号" :label-col="{ span: 4 }" prop="userName">
            <a-input style="width: 280px; margin-right: 20px" size="large" v-model="form.userName" placeholder="请输入账号" />
            <span class="text">默认密码：{{ form.password }}</span>
          </a-form-model-item>
          <a-form-model-item label="姓名" :label-col="{ span: 4 }" prop="name">
            <a-input size="large" v-model="form.name" placeholder="请输入姓名" />
          </a-form-model-item>

          <a-form-model-item label="工号" :label-col="{ span: 4 }" prop="employeeNumber">
            <a-input size="large" v-model="form.employeeNumber" placeholder="请输入工号" />
          </a-form-model-item>

          <a-form-model-item label="所属组织" :label-col="{ span: 4 }" prop="organization">
            <a-tree-select
              size="large"
              v-model="form.organization"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              :replaceFields="{
                children: 'children',
                title: 'deptName',
                value: 'id',
                key: 'id',
              }"
              placeholder="请选择所属组织"
              :treeDefaultExpandedKeys="expandedRowKeys"
            ></a-tree-select>
          </a-form-model-item>
          <a-form-model-item label="角色" :label-col="{ span: 4 }" prop="role">
            <a-select
              size="large"
              v-model="form.role"
              mode="multiple"
              placeholder="请选择角色"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              option-label-prop="label"
            >
              <a-select-option v-for="(item, index) in roleData" :key="index" :value="item.id" :label="item.roleName">{{ item.roleName }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
      </div>
      <div style="display: flex; justify-content: flex-end; padding-top: 26px">
        <a-button class="cancel-style" @click="onClose" style="margin-right: 20px">取消</a-button>
        <a-button class="primary-style" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { addBaseUsers, getSysRoles, getCode } from '../../../../../services/api_user'
export default {
  props: {
    treeData: {
      type: Array,
      default: []
    },
    expandedRowKeys: {
      type: Array,
      default: []
    },
    treeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      roleData: [],
      form: {
        userName: '',
        password: '888888',
        name: '',
        employeeNumber: '',
        organization: undefined,
        role: []
      },
      rules: {
        userName: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          { validator: this.checkUserName }
        ],
        name: [
          {
            required: true,
            validator: (rule, value, cbfn) => {
              if (value == '' || value == undefined) {
                cbfn('请输入姓名')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
        ],
        employeeNumber: [
          {
            required: true,
            required: true,
            message: '请输入工号',
            trigger: 'blur'
          },
          { validator: this.checkUserName }
        ],
        organization: [
          {
            required: true,
            message: '请选择所属组织',
            trigger: 'change'
          }
        ],
        role: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 自定义校验函数，
    checkUserName(rule, value, callback) {
      // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,10}$/;
      const reg = /^[\da-z]+$/i
      if (reg.test(value)) {
        if (value.length >= 2 && value.length <= 10) {
          callback()
        } else {
          callback('请输入2~15位英文或数字')
        }
      } else {
        callback('请输入2~15位英文或数字')
      }
    },
    afterVisibleChange(val) {
      console.log('visible', val)
      // 获取角色列表
      if (val) {
        if (this.treeId !== '') {
          this.form.organization = this.treeId
        }
        this.roleList()
      }
    },
    /** 获取角色列表 */
    roleList() {
      // console.log("角色列表");
      getSysRoles().then(res => {
        // console.log(res);
        if (res.status === 200) {
          this.roleData = res.data.rows
        }
      })
    },
    onClose() {
      this.$refs.ruleForm.resetFields()
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // alert("submit!");
          // console.log(this.form);
          const params = {
            deptId: this.form.organization,
            roleIds: this.form.role,
            user: {
              username: this.form.userName,
              password: this.form.password,
              name: this.form.name,
              employeeNumber: this.form.employeeNumber
            }
          }
          getCode({ code: this.form.userName }).then(res => {
            if (res.data) {
              addBaseUsers(params).then(res => {
                // console.log(res);
                if (res.status === 200 && res.data) {
                  this.$refs.ruleForm.resetFields()
                  this.visible = false
                  this.$message.success('保存成功')
                  this.$emit('refresh')
                } else {
                  this.$message.warning(res.message)
                }
              })
            } else {
              this.$message.warning('该帐号已存在')
            }
          })
        } else {
          // console.log("error submit!!");
          return false
        }
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
        background: #f5f4f4;
        padding: 20px;
        max-height: 863px;
        overflow: auto;
        .model {
          background: #ffffff;
          box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
          border-radius: 5px;
          padding: 29px 20px 23px 17px;
          .ant-form-item {
            .ant-form-item-control {
              width: 438px !important;
            }
          }
        }
      }
    }
  }
}
</style>
