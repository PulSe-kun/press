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
      {{ state_content.content }}
      <span>{{ state_content.title }}</span>？
    </div>
    <template slot="footer">
      <div class="footer_btn">
        <span style="color: #999999" @click="visible = false">
          {{
          cancelText
          }}
        </span>
      </div>
      <div class="footer_btn">
        <span style="color: #ed0000" @click="del_data">{{ okText }}</span>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { canDelete, deleteBaseDepts } from '../../../../services/api_user'
export default {
  props: {
    id: String
  },
  data() {
    return {
      state_content: {
        content: '是否删除该组织',
        title: ''
      },
      isRed: false, // 颜色
      visible: false,
      cancelText: '取消',
      okText: '确定删除'
    }
  },
  methods: {
    del_data() {
      // console.log(this.id);
      canDelete(this.id).then(res => {
        console.log(res)
        if (res.data) {
          deleteBaseDepts(this.id).then(res => {
            if (res.status == 200) {
              this.visible = false
              this.$message.success('删除成功')
              this.$emit('refresh')
            }
          })
        } else {
          this.visible = false
          this.$message.warning(res.message)
        }
      })
    }
  }
}
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
