<template>
  <a-drawer :closable="false" placement="top" :visible="visible" :after-visible-change="afterVisibleChange" wrapClassName="dialog">
    <div class="header">
      <span>编辑人员</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="账号" :label-col="{ span: 4 }" prop="userName">
            <a-input style="width: 280px; margin-right: 20px" size="large" v-model="form.userName" placeholder="请输入账号" disabled />
            <a @click="reset">重置密码</a>
          </a-form-model-item>
          <a-form-model-item label="姓名" :label-col="{ span: 4 }" prop="name">
            <a-input size="large" v-model="form.name" placeholder="请输入姓名" />
          </a-form-model-item>
          <a-form-model-item label="工号" :label-col="{ span: 4 }" prop="employeeNumber">
            <a-input size="large" v-model="form.employeeNumber" placeholder="请输入工号" disabled />
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
          <a-form-model-item label="状态" prop="isDisabled">
            <a-radio-group v-model="form.isDisabled" size="large" button-style="solid">
              <a-radio-button :value="0">正常</a-radio-button>
              <a-radio-button :value="1">停用</a-radio-button>
            </a-radio-group>
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
import { getSysRoles, resetPassword, updateBaseUsers, getCode } from '../../../../../services/api_user'
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
    dataObj: {
      type: Object,
      default: {}
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
        name: '',
        employeeNumber: '',
        organization: undefined,
        role: [],
        isDisabled: 1
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
            validator: (rule, value, cbfn) => {
              // console.log(value);
              if (value == '' || value == undefined) {
                cbfn('请输入工号')
              } else if (value.length > 20) {
                cbfn('最多可输入20个字')
              }
              cbfn()
            }
          }
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
        ],
        isDisabled: [
          {
            required: true,
            message: '请选择状态',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 自定义校验函数，
    checkUserName(rule, value, callback) {
      // console.log(value);
      const reg = /^(\w){2,10}$/
      if (!reg.test(value)) {
        callback('由2~15位英文、数字组成')
      } else {
        // 如果通过校验，调用无参数的 `callback()` 即可
        callback()
      }
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        console.log(this.dataObj)
        const list = []
        for (let i = 0; i < this.dataObj.roles.length; i++) {
          list.push(this.dataObj.roles[i].id)
        }
        this.form = {
          userName: this.dataObj.username,
          name: this.dataObj.name,
          employeeNumber: this.dataObj.baseUser.employeeNumber,
          organization: this.dataObj.depts.id,
          role: list,
          isDisabled: this.dataObj.isDisabled
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
    /** 重置密码 */
    reset() {
      resetPassword(this.dataObj.id).then(res => {
        // console.log(res);
        if (res.status === 200) {
          this.$message.success('密码已重置为888888')
          this.$refs.ruleForm.resetFields()
          this.visible = false
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
              id: this.dataObj.id,
              username: this.form.userName,
              password: this.form.password,
              name: this.form.name,
              employeeNumber: this.form.employeeNumber,
              isDisabled: this.form.isDisabled
            }
          }
          // console.log(params);
          // getCode({ code: this.form.userName }).then((res) => {
          //   if (res.data) {
          updateBaseUsers(this.dataObj.id, params).then(res => {
            // console.log(res);
            if (res.status === 200 && res.data) {
              this.visible = false
              this.$refs.ruleForm.resetFields()
              this.$message.success('保存成功')
              this.$emit('refresh')
            } else {
              this.$message.warning(res.message)
            }
          })
          // } else {
          //   this.$message.warning("该帐号已存在");
          // }
          // });
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
              .ant-radio-button-wrapper {
                border-radius: 4px !important ;
              }
              .ant-radio-button-wrapper:first-child {
                margin-right: 15px;
              }
              .ant-radio-button-wrapper:last-child {
                border-left: 1px solid #d9d9d9;
              }
            }
          }
        }
      }
    }
  }
}
</style>
