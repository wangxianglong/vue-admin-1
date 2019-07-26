<template>
  <div class="login-container">
    <el-form ref="loginBySMS" :model="loginBySMSForm" :rules="loginBySMSRules" class="login-form" auto-complete="on" label-position="left" v-show = "loginType === 'message'">
      <div class="title-container">
        <h3 class="title">短信登录</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="SMSUsername"
          v-model="loginBySMSForm.username"
          placeholder="用户手机号"
          name="SMSUsername"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="passwordNote" >
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="passwordNote"
          v-model="loginBySMSForm.passwordNote"
          placeholder="请输入短信验证码"
          name="passwordNote"
        />
        <span class="show-pwd"  @click="getSMS">
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
    <el-form ref="loginByPassword" :model="loginByPasswordForm" :rules="loginByPasswordRules" class="login-form" auto-complete="on" label-position="left" v-show = "loginType === 'password'">
      <div class="title-container">
        <h3 class="title">密码登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="passwordUsername"
          v-model="loginByPasswordForm.username"
          placeholder="Username"
          name="passwordUsername"
          type="text"
        />
      </el-form-item>

      <el-form-item prop="password" v-show = "loginType === 'password'">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="loginByPasswordForm.password"
          placeholder="请输入密码"
          name="password"
          type="text"
          onfocus="this.type='password'"
          autocomplete = "off"
        />

      </el-form-item>

      <el-form-item prop="verifycode" v-show = "loginType === 'password'">
          <el-input ref="verifycode" placeholder="请输入验证码" type="text" v-model="loginByPasswordForm.verifycode"></el-input>
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
import { validatePhone,validatePassword, validatePasswordNote,validateVerifycode } from '@/utils/validate'
import { gVerify } from '@/api/gVerify'
import url from '@/api/api.js'



export default {
  name: 'Login',
  data() {
    return {
      loginBySMSForm: {
        username: '15716597991',
        passwordNote:''
      },
      loginByPasswordForm: {
        username: '15716597991',
        password: '',
        verifycode:'',
      },
      loginBySMSRules: {
        username: [{ required: true, trigger: 'blur', validator: validatePhone }],
        passwordNote:[{ required: true, trigger: 'blur',validator: validatePasswordNote }],
      },
      loginByPasswordRules: {
        username: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifycode:[{ required: true, trigger: 'blur',validator: validateVerifycode }]
      },
      loginType: 'password',
      loading: false,
      messageTime : 0,
      timer:null
    }
  },
  mounted(){
    this.verifyCode = new GVerify("verifyCode");
    this.verifyCode.options.id = 'verifyCode';
  },
  methods: {
    handleLogin() {
      if(this.loginType === 'message'){
          this.$refs['loginBySMS'].validate((valid) => {
            if(valid){
              this.$axios.get(url.userCodeLogin,{
                params:{
                  mobile: this.loginBySMSForm.username,
                  code: this.loginBySMSForm.passwordNote                
                }
              }).then((res)=>{
                this.login();
              }).catch((error)=>{})
            }else {
              console.log('error submit!!')
              return false
            }
        })      
      }else{
        console.log(1);
        this.$refs['loginByPassword'].validate((valid) => {
            if(valid){
              if(this.verifyCode.codeValidate(this.loginByPasswordForm.verifycode)){
                this.$axios.post(url.userLogin,{
                    mobile:this.loginByPasswordForm.username,
                    pswd: this.loginByPasswordForm.password                               
                }).then((res)=>{
                  console.log(res);
                  this.login();
                }).catch((error)=>{})
              }else{
                this.$message('请输入正确的验证码');
                this.loginByPasswordForm.password = ''
                return false
              }
            } else {
              console.log('error submit!!')
              return false
            }
        })
      }
    },
    login(){
        this.loading = true

        // this.$store.dispatch('user/login', this.loginByPasswordForm).then(() => {
        //   this.$router.push('/')
        //   this.loading = false
        // }).catch(() => {
        //   this.loading = false
        // })
    },
    changeLoginType(){
      this.loginType = this.loginType  === "message" ? 'password' : 'message';
      this.verifyCode.refresh();
    },
    getSMS(){
      if(/^1[3456789]\d{9}$/.test(this.loginBySMSForm.username)){
        if(this.messageTime > 0) return;
        this.messageTime = 60;
        this.timer = setInterval(()=>{
          this.messageTime--;
          if(this.messageTime <= 0) {
            clearInterval(this.timer)
            this.messageTime = 0;
          }
        },100)
        this.$axios.get(url.userGetCode,{params:{mobile:this.loginBySMSForm.username}}).then((res)=>{
          if(res.status == 200){
            if(res.data.result == 200){
            }else{
              this.messageTime = 0;
              this.$alert(res.data.msg)
            }
          };         
        }).catch((error)=>{
        })
      }
    },
    changeVerifyCode(){
      this.verifyCode.refresh();
    }
  }
}
</script>

<style lang="scss">

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
   min-width: 400px;
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
    cursor: pointer;
    height:100%;
    width: 180px;
  }
}
</style>
