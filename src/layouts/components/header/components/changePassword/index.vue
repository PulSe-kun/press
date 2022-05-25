<template>
  <a-drawer
    :closable="false"
    placement="top"
    :visible="visible"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog"
  >
    <div class="header">
      <span>修改密码</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item has-feedback label="原密码" prop="password">
            <a-input
              v-model="form.password"
              placeholder="请输入原密码"
              type="password"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item has-feedback label="新密码" prop="pass">
            <a-input
              v-model="form.pass"
              type="password"
              placeholder="请输入新密码"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item has-feedback label="确认新密码" prop="checkPass">
            <a-input
              v-model="form.checkPass"
              type="password"
              placeholder="请再次输入新密码"
              autocomplete="off"
            />
          </a-form-model-item>
        </a-form-model>
      </div>
      <div style="display: flex; justify-content: flex-end; padding-top: 26px">
        <div>
          <a-button
            @click="onClose"
            class="cancel-style"
            style="
              margin-right: 20px;
              color: #b5b5b5;
              border: 1px solid #b4b4b4;
            "
          >
            取消
          </a-button>
          <a-button class="primary-style" type="primary" @click="onSubmit"
            >保存</a-button
          >
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
// import { modifyPassword } from "@/services/api_user";
const Base64 = require("js-base64").Base64;
export default {
  data() {
    let reg = new RegExp(/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,20}$/);
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码长度6~20位，数字、字母、字符至少包含两种"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (!reg.test(value)) {
        callback(new Error("密码长度6~20位，数字、字母、字符至少包含两种"));
      } else if (value !== this.form.pass) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        password: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        password: [{ validator: validatePassword, trigger: "change" }],
        pass: [{ validator: validatePass, trigger: "change" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }],
      },
    };
  },
  methods: {
    afterVisibleChange(val) {
      //   console.log("visible", val);
      if (val) {
      }
    },
    onClose() {
      this.$refs.ruleForm.resetFields();
      this.visible = false;
    },
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.$store.state.user.id,
            password: Base64.encode(this.form.password),
            newPassword: Base64.encode(this.form.pass),
          };
          // console.log(params);
          modifyPassword(params).then((res) => {
            // console.log(res);
            if (res.status === 200) {
              this.visible = false;
              this.$refs.ruleForm.resetFields();
              this.$message.success("修改成功");
              this.$parent.modifySuccessPage();
            }
          });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
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
        background: #201ba2;
        box-shadow: 0px 0px 5px 0px rgba(110, 110, 110, 0.36);
        padding-left: 20px;
        text-align: left;
        span {
          font-size: 18px;
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
              width: 438px;
            }
          }
        }
      }
    }
  }
}
</style>