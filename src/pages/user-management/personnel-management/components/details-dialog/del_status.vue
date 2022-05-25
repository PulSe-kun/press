<template>
  <a-modal
    v-model="visible"
    :closable="false"
    centered
    :bodyStyle="{
      padding: '0px',
      width: '530px',
      height: '274px',
    }"
    wrapClassName="state_dialog"
  >
    <div class="state_content">
      {{ state_content.content }}{{ state_name }} <span></span>？
    </div>
    <template slot="footer">
      <div class="footer_btn">
        <span style="color: #999999" @click="visible = false">{{
          cancelText
        }}</span>
      </div>
      <div class="footer_btn">
        <span style="color: #ed0000" @click="del_data">{{ okText }}</span>
      </div>
    </template>
  </a-modal>
</template>
<script>
export default {
  props: {
    state_name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      state_content: {
        content: "是否删除",
      },
      isRed: false, //颜色
      visible: false,
      cancelText: "取消",
      okText: "确定删除",
    };
  },
  methods: {
    del_data() {
      this.$emit("del_data");
    },
  },
};
</script>
<style lang="less" scoped>
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
