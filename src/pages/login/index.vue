<!-- 登录页面 -->
<template>
  <div class="login-page d-flex jc-end ai-center">
    <div class="login-container">
      <div class="login-container-item d-flex flex-column ai-center">
        <div class="login-container-title">
          <h1>川南压弹信息管理系统</h1>
        </div>
        <dv-border-box-10 class="login">
          <div class="login-title">用户登录</div>
          <a-form-model ref="loginForm" :model="formInline" :rules="rules">
            <div class="form-style">
              <span class="iconfont icon-user icon-style" :class="{ 'item-icon1': item_icon_type == 1 }"></span>
              <a-form-model-item prop="username">
                <a-input
                  size="large"
                  v-model="formInline.username"
                  @keyup.enter="handleSubmit"
                  placeholder="请输入账号"
                  @focus="item_icon_type = 1"
                  @blur="item_icon_type = 0"
                >
                  <!-- <span slot="prefix" class="iconfont icon-user"></span> -->
                </a-input>
              </a-form-model-item>
            </div>
            <div class="form-style">
              <span class="iconfont icon-mima icon-style" :class="{ 'item-icon2': item_icon_type == 2 }"></span>
              <a-form-model-item prop="password">
                <a-input
                  size="large"
                  v-model="formInline.password"
                  type="password"
                  @keyup.enter="handleSubmit"
                  placeholder="请输入密码"
                  @focus="item_icon_type = 2"
                  @blur="item_icon_type = 0"
                >
                  <!-- <span slot="prefix" class="iconfont icon-mima"></span> -->
                </a-input>
              </a-form-model-item>
            </div>
          </a-form-model>
          <div class="login-rembember">
            <a @click="rembember">忘记密码？</a>
          </div>
          <div class="login-submit">
            <a-button size="large" type="primary" class="login-btn-style" @click="handleSubmit" :loading="loading">登录</a-button>
          </div>
        </dv-border-box-10>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'
import { getSysMenus } from '@/services/api_user'
// import { setToken } from '@/utils/auth' // get token from cookie
const Base64 = require('js-base64').Base64
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      loading: false,
      item_icon_type: 0,
      cardList: '',
      formInline: {
        username: 'zhanggong',
        password: '888888'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入正确的账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入正确的密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    handleSubmit() {
      this.loading = true
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 封装登陆数据
          const loginData = { ...this.formInline }
          // 密码Base64编码
          loginData.password = Base64.encode(this.formInline.password)
          // setToken(1)
          // this.$router.push({ path: '/' })
          // setTimeout(() => {
          //   this.$notification.success({
          //     message: '欢迎',
          //     description: `${timeFix()}，欢迎回来`
          //   })
          // }, 1000)
          this.$store
            .dispatch('user/login', loginData)
            .then(res => {
              console.log(res)
              this.loading = false
              if (res.access_token) {
                // 注意：message全局提示
                // this.$message.success("登录成功");
                this.$message.success('登录成功', 1)
                // 路由跳转重定向页面或者首页
                getSysMenus().then(res => {
                  console.log(res)
                  if (res.status === 200) {
                    window.localStorage.setItem('systemId', res.data[0].id)
                    console.log(localStorage.getItem('systemId'))
                    this.$router.push({ path: '/' })
                  } else {
                    this.$message.warning('该账号已停用', 2)
                  }
                })
                // this.getSysMenusData()
                // setTimeout(() => {
                //   this.$router.push({ path: '/' })
                // }, 100)
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          // console.log("error submit!!");
          this.$notification.error({
            message: '错误',
            description: '账号密码不能为空',
            duration: 4
          })
          this.loading = false
          return false
        }
      })
    },
    rembember() {
      this.$message.warning('请联系管理员重置密码')
    },
    /** 获取系统数据 */
    getSysMenusData() {
      getSysMenus().then(res => {
        console.log(res)
        if (res.status === 200) {
          window.localStorage.setItem('systemId', res.data[0].id)
          console.log(localStorage.getItem('systemId'))
        }
      })
    }
  },

  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
}
</script>
<style lang="less" scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: auto;
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    display: block;
    z-index: -1;
    background: url('../../assets/imgs/img-bg.jpg');
    background-size: cover;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
  }
  .login-container {
    z-index: 999;
    // min-width: 695px;
    width: 36.2%;
    height: 570px;
    margin-right: 9.17%;
    display: block;
    margin-top: -89px;
    .login-container-item {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .login-container-title {
        h1 {
          font-size: 40px;
          font-weight: bold;
          line-height: 40px;
          color: #00bff4;
          margin: 0;
          padding: 0;
        }
      }
      .login {
        margin-top: 49px;
        /deep/.border-box-content {
          padding: 0 64px;
          .login-title {
            width: 100%;
            text-align: center;
            margin: 46px 0 42px 0;
            font-size: 30px;
            line-height: 30px;
            color: #00bff4;
          }
          .login-rembember {
            padding-top: 5px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-direction: row;
            a {
              font-size: 14px;
              color: #fff;
            }
          }
          .login-submit {
            margin-top: 28px;
            .ant-btn {
              width: 100%;
              height: 62px;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 27px;
  width: calc(100% - 80px);
}
/deep/.ant-form-item-with-help {
  margin-bottom: 8px;
}
/deep/.ant-form-item-control {
  line-height: 62px;
}
// /deep/.ant-form-item-children {
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   > span:first-child {
//     display: inline-block;
//     height: 62px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     width: 74px;
//     border-radius: 4px 0 0 4px;
//     border: 3px solid rgba(11, 161, 248, 0.5);
//     font-size: 24px;
//     color: #0ba1f8;
//     background: rgba(6, 135, 205, 0.3);
//   }
// }
.form-style {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.icon-style {
  display: inline-block;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  border-radius: 4px 0 0 4px;
  border: 3px solid rgba(11, 161, 248, 0.5);
  font-size: 24px;
  color: #0ba1f8;
  background: rgba(6, 135, 205, 0.3);
}
.item-icon1,
.item-icon2 {
  background: rgba(6, 135, 205, 0.7) !important;
}
/deep/.ant-input {
  color: #fff !important ;
  height: 62px;
  background: rgba(6, 135, 205, 0.3) !important;
  border-width: 3px !important;
  border-color: rgba(11, 161, 248, 0.3) !important;
  border-left: none !important;
  border-radius: 0 4px 4px 0;
}
/deep/.ant-input:hover {
  border-color: rgba(11, 161, 248, 0.3) !important;
  border-right-width: 3px !important;
}
/deep/.ant-input:focus {
  border-color: rgba(11, 161, 248, 0.3) !important;
  border-right-width: 3px !important;
  box-shadow: none !important;
}
</style>
<style lang="less" scoped>
@media screen and (min-width: 1920px) {
  .login-container {
    width: 695px !important;
  }
}
@media screen and (max-width: 1200px) {
  .login-container {
    width: 434px !important;
  }
}
</style>
