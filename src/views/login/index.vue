<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" v-show = "loginType === 'message'">
      <div class="title-container">
        <h3 class="title">短信登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="passwordNote" >
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="passwordNote"
          v-model="loginForm.passwordNote"
          :type="passwordType"
          placeholder="请输入短信验证码"
          name="passwordNote"
        />
        <span class="show-pwd"  @click="getMessage">
          <el-button type="primary" v-if = "messageTime === 0">获取短信</el-button>
          <el-button type="primary" v-else disabled>{{messageTime}}后再发送</el-button>
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <el-button type="text" @click="changeLoginType">切换{{loginType === "message" ? '密码登录' : '短信登录'}}</el-button>
      <router-link to="/forgetPassword">
          <el-button type="text" >忘记密码</el-button>
      </router-link>


    </el-form>
    <el-form ref="loginFormPassword" :model="loginFormPassword" :rules="loginRulesPassword" class="login-form" auto-complete="on" label-position="left" v-show = "loginType === 'password'">
      <div class="title-container">
        <h3 class="title">密码登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginFormPassword.username"
          placeholder="Username"
          name="username"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password" v-show = "loginType === 'password'">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginFormPassword.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>

      </el-form-item>

      <el-form-item prop="verifycode" v-show = "loginType === 'password'">
          <el-input ref="verifycode" placeholder="请输入验证码" type="text" v-model="loginFormPassword.verifycode"></el-input>
          <span id="verifyCode" class="show-verifyCode" @click="changeVerifyCode"></span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <el-button type="text" @click="changeLoginType">切换{{loginType === "message" ? '密码登录' : '短信登录'}}</el-button>
      <router-link to="/forgetPassword">
          <el-button type="text" >忘记密码</el-button>
      </router-link>
    </el-form>
  </div>
</template>

<script>
import { validateUsername,validatePassword, validatePasswordNote,validateVerifycode} from '@/utils/validate'
import { gVerify } from '@/api/gVerify'
import { setTimeout, clearTimeout } from 'timers';
import axios from 'axios'
import url from '@/api/api.js'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '15765453456',
        passwordNote:''
      },
      loginFormPassword: {
        username: '15765453456',
        password: '',
        verifycode:'',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        passwordNote:[{ required: true, trigger: 'blur',validator: validatePasswordNote }],
      },
      loginRulesPassword: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifycode:[{ required: true, trigger: 'blur',validator: validateVerifycode }]
      },
      loginType: 'password',
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      messageTime : 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted(){
    this.verifyCode = new GVerify("verifyCode");
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if(this.loginType === 'message'){
          this.$refs['loginForm'].validate((valid) => {
            if(valid){
              this.loading = true
              this.$store.dispatch('user/login', this.loginForm).then(() => {
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            } else {
              console.log('error submit!!')
              return false
            }
        })      
      }else{
        this.$refs['loginFormPassword'].validate((valid) => {
            if(valid){
              this.loading = true
              this.$store.dispatch('user/login', this.loginFormPassword).then(() => {
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            } else {
              console.log('error submit!!')
              return false
            }
        })
      }
    },
    changeLoginType(){
      this.loginType = this.loginType  === "message" ? 'password' : 'message';
      this.verifyCode.options.id = 'verifyCode';
      this.verifyCode.refresh();

    },
    getMessage(){
      if(this.timer) return;
      this.messageTime = 60;
      this.timer = setInterval(()=>{
        this.messageTime--;
        if(this.messageTime == 0) clearInterval(this.timer)
      },1000)
      if(!this.$refs.username.validateState){
        axios.post(url.getMessage,this.loginForm.username).then((res)=>{
          console.log(res.data);
        })
      }
    },
    changeVerifyCode(){
      this.verifyCode.refresh();
      // console.log(this.verifyCode.options.code);
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}


$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .show-verifyCode{
    position: absolute;
    right: 0px;
    // top: 7px;
    cursor: pointer;
    height:100%;
    width: 180px;
  }
}
</style>