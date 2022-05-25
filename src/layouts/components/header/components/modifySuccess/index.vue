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
      <span>修改密码</span>
    </div>
    <div class="footer">
      <div class="model">
        <!-- <img src="@/assets/img/modify.png" alt="" /> -->
        <div>账号密码修改成功</div>
        <div>修改密码后需要使用新密码登陆</div>
        <a-button
          class="primary-style"
          style="width: 220px; margin-top: 47px"
          type="primary"
          size="large"
          @click="againLogin"
          >重新登录</a-button
        >
      </div>
    </div>
  </a-drawer>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    afterVisibleChange(val) {},
    /**重新登录 */
    async againLogin() {
      this.visible = false;
      await this.$store.dispatch("user/logout");
      this.$message.success("退出成功");
      this.$router.push(`/login`);
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
          padding: 50px 20px;
          text-align: center;
          img {
            width: 74px;
            height: 74px;
            margin-top: 17px;
          }
          > div:nth-child(2) {
            height: 18px;
            font-size: 18px;
            font-weight: 600;
            color: #000000;
            line-height: 18px;
            margin-top: 25px;
          }
          > div:nth-child(3) {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.5);
            margin-top: 15px;
          }
        }
      }
    }
  }
}
</style>
