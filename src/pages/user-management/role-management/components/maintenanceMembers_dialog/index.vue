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
      <span>维护成员</span>
      <a-icon type="close" @click="onClose" />
    </div>
    <div class="footer">
      <div class="model">
        <div>
          <!-- <a-input-search
            style="margin-bottom: 8px"
            placeholder="Search"
            @change="onChange"
          />-->
          <a-tree
            v-if="treeData.length"
            checkable
            v-model="checkedKeys"
            :tree-data="treeData"
            :replaceFields="{
              children: 'children',
              title: 'name',
              key: 'id',
            }"
            :selectedKeys="selectedKeys"
            :defaultExpandedKeys="expandedRowKeys"
            @check="checkTree"
          >
            <template slot="name" slot-scope="item" style="color: #08c">
              <p class="tree-font">
                <span class="dot"></span>
                {{ item.name }}
              </p>
            </template>
          </a-tree>
        </div>
        <div>
          <div class="title">
            <span></span>
            <span>已选列表</span>
          </div>
          <ul>
            <li :title="item" v-for="(item, index) in list" :key="index">{{ item.name }}</li>
          </ul>
        </div>
      </div>
      <div class="btn">
        <a-button class="cancel-style" @click="onClose">取消</a-button>
        <a-button class="primary-style" type="primary" @click="onSubmit">保存</a-button>
      </div>
    </div>
  </a-drawer>
</template>
<script>
import { getDeptUserTree, compileSysRolesUserRole, getSysRolesUserRole } from '@/services/api_user'
import vPinyin from '../../../../../utils/vue-py'
export default {
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      level: 0,
      pid: '',
      visible: false,
      organization_count: 0,
      organization_list: [],
      treeData: [],
      checkedKeys: [],
      expandedRowKeys: [],
      selectedKeys: [],
      list: []
    }
  },
  methods: {
    /** 展示树形结构 三层 */
    setNode(data, parentId) {
      // console.log(this.pid, 111,parentId);
      if (this.pid != parentId) {
        this.level++
      }
      this.pid == parentId
      var num
      for (var i = 0; i < data.length; i++) {
        num = i
        // data[i].parentId = parentId;
        data[i].level = this.level
        if (data[i].type == 0) {
          data[i].disableCheckbox = true
        }
        if (
          data[i].id == '5930adc918db49cdbc88bef4f6048213' ||
          data[i].id == '0515ba6bb3f34bc384762e723c63a7cc' ||
          data[i].id == 'bb293ea285d14dec86a6fa90cfac30ef'
        ) {
          data[i].disableCheckbox = true
        }
        if (data[i].children && data[i].children.length > 0) {
          if (this.level <= 2) {
            this.organization_list.push(data[i].id)
          }
          this.setNode(data[i].children, data[i].id)
        } else {
          data[i].scopedSlots = { title: 'name' }
        }
      }
      // console.log(num, data);
      if (num === data.length - 1) {
        this.level = data[0].level - 1
      }
      return data
    },
    afterVisibleChange(val) {
      // console.log("visible", val);
      if (val) {
        // console.log(vPinyin.chineseToPinYin("你好"));
        this.getDeptUserTreeData()
      }
    },
    /** 按照中文排序 */
    pinyinSort(array) {
      const resultArray = array.sort(function compareFunction(param_1, param_2) {
        // console.log(param1, param2)
        const param1 = vPinyin.chineseToPinYin(param_1.name).substr(0, 1).toLowerCase()
        const param2 = vPinyin.chineseToPinYin(param_2.name).substr(0, 1).toLowerCase()
        console.log(param1, param2)
        const reg = /[a-zA-Z0-9]/
        if (reg.test(param1) || reg.test(param2)) {
          if (param1 > param2) {
            return 1
          } else if (param1 < param2) {
            return -1
          } else {
            return 0
          }
        }
        // else {
        //   return param1.localeCompare(param2, "zh");
        // }
      })
      return resultArray
    },
    getSysRolesUserRoleData() {
      getSysRolesUserRole(this.item.id).then(res => {
        // console.log(res);
        if (res.status) {
          for (let i = 0; i < res.data.length; i++) {
            this.checkedKeys.push(res.data[i].userId)
          }
          const array = []
          for (let j = 0; j < this.checkedKeys.length; j++) {
            // console.log(this.checkedKeys);
            // console.log(
            //   this.getItemByIdInTree(this.checkedKeys[j], this.treeData)
            // );
            array.push(this.getItemByIdInTree(this.checkedKeys[j], this.treeData))
          }
          // console.log(array);
          const list = []
          for (let k = 0; k < array.length; k++) {
            list.push({
              id: array[k].id,
              name: array[k].name
            })
          }
          // console.log(this.pinyinSort(list));
          this.list = this.pinyinSort(list)
        }
      })
    },
    /** 根据id获取节点信息 */
    getItemByIdInTree(id, tree) {
      // console.log(id, tree);
      let res = null
      for (let i = 0; i < tree.length; i++) {
        const ele = tree[i]
        ele.id === id ? (res = ele) : ''
        if (res) break
        if (ele.children.length) {
          res = this.getItemByIdInTree(id, ele.children)
        }
      }
      return res
    },
    /** 获取组织范围 */
    getDeptUserTreeData() {
      getDeptUserTree().then(res => {
        if (res.status === 200) {
          // console.log(res.data);
          // this.getAllTreeList(res.data);
          this.setNode(res.data)
          this.expandedRowKeys = this.organization_list
          this.treeData = res.data
          this.getSysRolesUserRoleData()
        }
      })
    },
    checkTree(checkedKeys, { checkedNodes, node }) {
      // console.log(checkedNodes);
      const list = []
      for (let i = 0; i < checkedNodes.length; i++) {
        list.push({
          id: checkedNodes[i].data.props.id,
          name: checkedNodes[i].data.props.name
        })
      }
      // console.log(this.pinyinSort(list));
      this.list = this.pinyinSort(list)
    },
    onClose() {
      this.visible = false
      this.level = 0
      this.checkedKeys = []
      this.organization_count = 0
      this.organization_list = []
      this.expandedRowKeys = []
      this.selectedKeys = []
      this.treeData = []
      this.list = []
    },
    onSubmit() {
      const list = []
      if (this.list.length == 0) {
        this.$message.warning('请选择成员')
        return false
      } else {
        for (let i = 0; i < this.list.length; i++) {
          list.push(this.list[i].id)
        }
      }
      console.log(list)
      compileSysRolesUserRole(this.item.id, { userIds: list }).then(res => {
        // console.log(res);
        if (res.status == 200) {
          this.visible = false
          this.checkedKeys = []
          this.organization_count = 0
          this.organization_list = []
          this.expandedRowKeys = []
          this.selectedKeys = []
          this.treeData = []
          this.list = []
          this.$message.success('保存成功')
          this.$emit('refresh')
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
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          margin-bottom: 30px;
          > div:first-child {
            margin-right: 10px;
          }
          > div:last-child {
            position: relative;
            .title {
              height: 20px;
              position: absolute;
              left: 20px;
              top: 20px;
              z-index: 999;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              span:first-child {
                display: inline-block;
                width: 5px;
                height: 20px;
                background: @theme-color;
              }
              span:last-child {
                display: inline-block;
                margin-left: 10px;
                font-size: 20px;
                font-weight: 600;
                color: #818181;
              }
            }
            ul {
              overflow-y: auto;
              overflow-x: hidden;
              height: 672px;
              padding: 0;
              margin-top: 29px;
              li {
                width: 241px;
                height: 46px;
                line-height: 46px;
                padding: 0 19px;
                border-bottom: 1px solid #e6e5e5;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          > div {
            width: 285px;
            height: 730px;
            overflow: auto;
            background: #ffffff;
            box-shadow: -2px 2px 7px 0px rgba(179, 179, 179, 0.4);
            border-radius: 5px;
            padding: 15px 20px;
          }
        }
        .btn {
          height: 40px;
          text-align: right;
          .ant-btn:first-child {
            margin-right: 22px;
          }
        }
      }
    }
  }
}
</style>
