<template>
  <a-drawer
    :closable="false"
    placement="right"
    :zIndex="999"
    :visible="visible"
    width="620"
    :after-visible-change="afterVisibleChange"
    wrapClassName="dialog-right"
    :mask="false"
    @close="onClose"
  >
    <div class="header">
      <div class="header-title">
        <span v-if="dataObj">{{ dataObj.name }}</span>
        <a-icon type="close" @click="onClose" />
      </div>
      <div class="header-btn" v-if="dataObj">
        <a
          v-if="
            dataObj.id !== 'bb293ea285d14dec86a6fa90cfac30ef' &&
            dataObj.id !== '5930adc918db49cdbc88bef4f6048213' &&
            dataObj.id !== '0515ba6bb3f34bc384762e723c63a7cc'
          "
          @click="compile"
        >
          <a-icon type="edit" style="fontSize:20px;padding-right: 5px;" />编辑
        </a>
        <a
          v-if="
            dataObj.id !== 'bb293ea285d14dec86a6fa90cfac30ef' &&
            dataObj.id !== '5930adc918db49cdbc88bef4f6048213' &&
            dataObj.id !== '0515ba6bb3f34bc384762e723c63a7cc'
          "
          @click="del"
        >
          <a-icon type="delete" style="fontSize:20px;padding-right: 5px;" />删除
        </a>
      </div>
    </div>
    <div class="footer">
      <div class="footer-title">
        <!-- <div class="footer-title-header">
          <span></span>
          <span>基础信息</span>
        </div>-->
        <div class="footer-title-model">
          <a-descriptions :column="1" v-if="dataObj">
            <a-descriptions-item label="账号">
              {{
              dataObj.username
              }}
            </a-descriptions-item>
            <a-descriptions-item label="工号">
              {{
              dataObj.baseUser["employeeNumber"]
              }}
            </a-descriptions-item>
            <a-descriptions-item label="所属组织">
              <span v-if="dataObj.depts">{{ dataObj.depts["deptName"] }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              <span style="margin-right: 5px" v-for="(item, index) in dataObj.roles" :key="index">
                <span v-if="item == null">暂无角色</span>
                <span v-else>{{ item.roleName }}</span>
              </span>
            </a-descriptions-item>
            <a-descriptions-item label="状态">
              <span v-if="dataObj.isDisabled == 0">正常</span>
              <span v-if="dataObj.isDisabled == 1">停用</span>
            </a-descriptions-item>
          </a-descriptions>
        </div>
      </div>
    </div>
    <template v-if="dataObj">
      <Del_status ref="del_status" :state_name="dataObj.name" @del_data="del_data" />
    </template>
  </a-drawer>
</template>
<script>
import Del_status from './del_status'
import { deleteBaseUsers } from '../../../../../services/api_user'
export default {
  props: {
    dataObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      visible: false
    }
  },
  components: {
    Del_status
  },
  methods: {
    compile() {
      this.visible = false
      this.$parent.compile(this.dataObj)
    },
    del() {
      this.$refs.del_status.visible = true
    },
    /** 删除数据 */
    del_data() {
      // console.log(this.dataObj.id);
      deleteBaseUsers(this.dataObj.id).then(res => {
        if (res.status === 200) {
          this.visible = false
          this.$refs.del_status.visible = false
          this.$message.success('删除成功')
          this.$emit('refresh')
        }
      })
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      // if (val) {
      //   console.log(this.dataObj);
      // }
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
        padding: 20px;
        overflow: auto;
        .footer-title {
          //   .footer-title-header {
          //     height: 20px;
          //     span:first-child {
          //       display: inline-block;
          //       width: 5px;
          //       height: 20px;
          //       background: @theme-color  ;
          //       margin-right: 15px;
          //     }
          //     span:last-child {
          //       height: 20px;
          //       line-height: 20px;
          //       font-size: 18px;
          //       font-weight: 500;
          //       color: #818181;
          //       vertical-align: top;
          //     }
          //   }
          .footer-title-model {
            background: #ffffff;
            box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
            border-radius: 3px;
            padding-top: 37px;
            padding-bottom: 12px;
            padding-left: 25px;
            .ant-descriptions-row > td {
              padding-bottom: 30px !important;
              .ant-descriptions-item-content {
                font-size: 16px;
                font-weight: 600;
                color: #000000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
