<template>
  <a-drawer
    :closable="false"
    placement="top"
    :zIndex="999"
    :visible="visible"
    wrapClassName="dialog"
    :after-visible-change="afterVisibleChange"
  >
    <div class="header">
      <div class="header-title" v-if="item">
        <span>{{this.item.productTaskNum}}</span>
        <a-icon type="close" @click="onClose" />
      </div>
    </div>
    <div class="footer">
      <div class="footer-title">
        <span></span>
        <h3>故障信息</h3>
      </div>
      <div class="dialog-content">
        <div>
          <a-table
            :columns="columns"
            :data-source="dataList"
            bordered
            :pagination="false"
            :rowKey="
              (record, index) => {
                return index;
              }
            "
          ></a-table>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { getListForTaskId } from '@/services/production/query'
export default {
  props: {
    item: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      dataList: [],
      columns: [
        {
          title: '故障代码',
          dataIndex: 'faultCode',
          align: 'center'
        },
        {
          title: '故障名称',
          dataIndex: 'faultName',
          align: 'center'
        },
        {
          title: '开始时间',
          dataIndex: 'faultStartTime',
          align: 'center'
        },
        {
          title: '结束时间',
          dataIndex: 'faultEndTime',
          align: 'center'
        }
      ]
    }
  },
  components: {},
  methods: {
    afterVisibleChange(val) {
      // console.log(val)
      if (val) {
        getListForTaskId(this.item.uuid).then(res => {
          console.log(res)
          this.dataList = res.data.rows
        })
      }
    },
    onClose() {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialog {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  //overflow-y: auto !important;
  /deep/.ant-drawer-content-wrapper {
    max-width: 620px;
    //margin-top: 80px;
    height: 70vh !important;
    background: #f5f4f4;
    border-radius: 5px;
    overflow: hidden;
    .ant-drawer-body {
      height: 100%;
      padding: 0;
      .header {
        padding: 20px;
        height: 60px;
        background: @theme-color;
        box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
        border-radius: 3px 3px 0px 0px;
        .header-title {
          position: relative;
          height: 20px;
          span {
            font-size: 18px;
            color: #ffffff;
            line-height: 20px;
          }
          i {
            position: absolute;
            top: 3px;
            right: 0;
            color: #ffffff;
            font-size: 15px;
          }
        }
        .header-state {
          height: 20px;
          line-height: 20px;
          color: #fff;
          font-size: 16px;
          // margin-bottom: 30px;
        }
      }
      .footer {
        height: calc(100% - 60px);
        background: #f5f4f4;
        padding: 20px;
        padding-top: 0;
        overflow: auto;
        .footer-title {
          padding-top: 21px;
          padding-bottom: 11px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            display: inline-block;
            width: 5px;
            height: 20px;
            margin-right: 10px;
            background: #585858;
          }
          h3 {
            margin: 0;
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            //color: #818181;
            font-weight: bold;
          }
        }
        .dialog-content {
          padding: 20px;
          background: #fff;
          box-shadow: 0px 1px 4px 0px rgba(179, 179, 179, 0.4);
          border-radius: 3px;
          .ant-descriptions-row > td {
            line-height: 16px;
            padding: 0;
            padding-bottom: 18px !important;
            .ant-descriptions-item-label {
              float: left;
              display: inline-block;
              font-size: 16px;
              height: 16px;
              line-height: 16px;
              width: 130px;
              text-align: right;
            }
            .ant-descriptions-item-content {
              margin-left: 130px;
              display: block;
              // height: 16px;
              line-height: 16px;
              font-size: 16px;
              //font-family: 'SourceHanSansSC-Medium';
              color: #000000;
            }
          }
        }
      }
    }
  }
}
</style>
