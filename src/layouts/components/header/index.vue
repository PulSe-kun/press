<template>
  <div id="myheader">
    <div class="content-box">
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="require('../../../assets/imgs/people.png')" />
          <span>{{ name }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <a-icon type="user" />
            <span>个人中心</span>
          </a-menu-item>
          <a-menu-item key="1">
            <a-icon type="setting" />
            <span>账户设置</span>
          </a-menu-item>-->
          <a-menu-item key="2">
            <a @click="changePassword">
              <a-icon type="setting" />
              <span>修改密码</span>
            </a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <template>
        <ChangePassword ref="changePassword" />
        <ModifySuccess ref="modifySuccess" />
      </template>
    </div>
  </div>
</template>
<script>
import { ChangePassword, ModifySuccess } from './components/index'
import { mapGetters } from 'vuex'
export default {
  name: 'myheader',
  components: {},
  computed: {
    ...mapGetters(['name'])
  },
  components: {
    ChangePassword,
    ModifySuccess
  },
  mounted() {},
  methods: {
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          setTimeout(() => {
            this.$store.dispatch('user/logout').then(() => {
              this.$router.push('/login')
            })
          }, 1000)
          this.$message.success('退出成功')
        }
      })
    },
    /** 修改密码 */
    changePassword() {
      this.$refs.changePassword.visible = true
    },
    /** 修改密码成功 */
    modifySuccessPage() {
      this.$refs.modifySuccess.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
#myheader {
  float: right;
  height: 100%;
  padding-right: 12px;
  .action {
    cursor: pointer;
    padding: 0 12px;
    display: inline-block;
    transition: all 0.3s;
    height: 100%;
    color: rgba(0, 0, 0, 0.65);

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }

    .avatar {
      margin: 20px 8px 20px 0;
      color: #1890ff;
      background: hsla(0, 0%, 100%, 0.85);
      vertical-align: middle;
    }

    .icon {
      font-size: 16px;
      padding: 4px;
    }
  }
}
// 外置的样式控制
.user-dropdown-menu {
  span {
    user-select: none;
  }
}
.user-dropdown-menu-wrapper.ant-dropdown-menu {
  padding: 4px 0;

  .ant-dropdown-menu-item {
    padding: 5px 12px;
    width: 160px;
  }

  .ant-dropdown-menu-item > .anticon:first-child,
  .ant-dropdown-menu-item > a > .anticon:first-child,
  .ant-dropdown-menu-submenu-title > .anticon:first-child .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }
}
</style>

<style lang="less" scoped>
.header-bg {
  #myheader {
    .action {
      color: #fff !important;
      &:hover {
        background: rgba(250, 250, 250, 0.05);
      }
    }
  }
}
</style>
