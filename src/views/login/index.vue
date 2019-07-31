<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-icon">
        <svg-icon icon-class="logo" class="logo-icon"/>
      </div>
      <div class="login">
        <el-form ref="loginBySMS" :model="loginBySMSForm" :rules="loginBySMSRules" class="login-form" auto-complete="on" label-position="left" v-show = "loginType === 'message'">
          <div class="title-container">
            手机快捷登录
          </div>
          <div type="text" @click="changeLoginType" class="changTypeButton">
            {{loginType === "message" ? '账号密码登录' : '手机快捷登录'}}<svg-icon icon-class="arrow"/>
          </div>
          <el-form-item prop="username" class="mobile-form">
            <span class="svg-container">
              <svg-icon icon-class="mobile" class="input-icon"/>
            </span>
            <el-input
              ref="SMSUsername"
              v-model="loginBySMSForm.username"
              placeholder="请输入用户手机号"
              name="SMSUsername"
              type="text"
              onKeyUp = "this.value=this.value.replace(/[^\d]/g,'')"
              clearable
            />
          </el-form-item>
          <el-form-item prop="passwordNote" class="text-form">
            <span class="svg-container">
              <svg-icon icon-class="password" class="input-icon"/>
            </span>
            <el-input
              ref="passwordNote"
              v-model="loginBySMSForm.passwordNote"
              placeholder="请输入短信验证码"
              name="passwordNote"
              onKeyUp = "this.value=this.value.replace(/[^\d]/g,'')"
              clearable
            />
            <span class="show-pwd"  @click="getSMS">
              <el-button type="primary" v-if = "messageTime === 0">获取短信</el-button>
              <el-button type="primary" v-else disabled>{{messageTime}}后再发送</el-button>
            </span>
          </el-form-item>

          <el-button :loading="loading" type="primary" class="loading" @click.native.prevent="handleLogin">登录</el-button>
          <router-link to="/forgetPassword">
              <el-button type="text" class="forgetPswd">忘记密码?</el-button>
          </router-link>


        </el-form>
        <el-form ref="loginByPassword" :model="loginByPasswordForm" :rules="loginByPasswordRules" class="login-form" auto-complete="on" label-position="left" v-show = "loginType === 'password'">
          <div class="title-container">
            账号密码登录
          </div>

          <div type="text" @click="changeLoginType" class="changTypeButton">
            {{loginType === "message" ? '账号密码登录' : '手机快捷登录'}}<svg-icon icon-class="arrow"/>
          </div>

          <el-form-item prop="username" class="mobile-form">
            <span class="svg-container icon" >
              <svg-icon icon-class="mobile" class="input-icon"/>
            </span>
            <el-input
              ref="passwordUsername"
              v-model="loginByPasswordForm.username"
              placeholder="请输入手机号"
              name="passwordUsername"
              type="text"
              onKeyUp = "this.value=this.value.replace(/[^\d]/g,'')"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password" v-show = "loginType === 'password'" class="pwsd-from">
            <span class="svg-container">
              <svg-icon icon-class="password" class="input-icon"/>
            </span>
            <el-input
              ref="password"
              v-model="loginByPasswordForm.password"
              placeholder="请输入密码"
              name="password"
              type="text"
              onfocus="this.type='password'"
              autocomplete = "off"
              clearable
            />

          </el-form-item>

          <el-form-item prop="verifycode" v-show = "loginType === 'password'" class="code-form"> 
              <el-input ref="verifycode" 
                placeholder="请输入验证码" 
                type="text" 
                v-model="loginByPasswordForm.verifycode"
                onKeyUp = "this.value=this.value.replace(/[^\w]/g,'')"
                clearable
              ></el-input>
              <span id="verifyCode" class="show-verifyCode" @click="changeVerifyCode"></span>
          </el-form-item> 

          <el-button :loading="loading" type="primary" class="loading" @click.native.prevent="handleLogin">登录</el-button>
          <router-link to="/forgetPassword">
              <el-button type="text" class="forgetPswd">忘记密码?</el-button>
          </router-link>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import { validatePhone,validatePassword, validatePasswordNote,validateVerifycode } from '@/utils/validate'
import { gVerify } from '@/api/gVerify'
import url from '@/api/api.js'
import axios from 'axios'


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
      timer:null,
      redirect: undefined
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
              }).catch((error)=>{
                console.log(error);
              })
            }else {
              console.log('error submit!!')
              return false
            }
          })     
      }else{
        this.login();
        this.$refs['loginByPassword'].validate((valid) => {
            if(valid){
              var password = this.loginByPasswordForm.password;
              this.loginByPasswordForm.password = '';
              if(this.verifyCode.codeValidate(this.loginByPasswordForm.verifycode)){
                this.$axios.post(url.userLogin,{
                    mobile:this.loginByPasswordForm.username,
                    pswd: password                               
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
        this.$store.dispatch('user/login', this.loginByPasswordForm).then(() => {
          this.$router.push(this.redirect)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
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
        },1000)
        this.$axios.get(url.userGetCode,{
          params:{
            mobile:this.loginBySMSForm.username
          }
        }).then((res)=>{
          if(res.status == 200){
            console.log(res);
            // if(res.data.result == 200){
            // }else{
            //   this.messageTime = 0;
            //   this.$alert(res.data.msg)
            // }
          };         
        }).catch((error)=>{
        })
      }
    },
    changeVerifyCode(){
      this.verifyCode.refresh();
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">

$bg:#0091FF;

.login-container{
  width: 100%;
  height: 100%;
  background-color: $bg;
  position: relative;
  .login-content{
    width: 970px;
    height: 540px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .login-icon{
      width: 470px;
      height: 100%;
      background-color: $bg;
      opacity: .6;
      float: left;
      .logo-icon{
        height: 125px;
        width: 136px;
        position: absolute;
        top: 158px;
        left: 173px;
      }
    }
    .login{
      width: 500px;
      height: 100%;
      margin-left: 470px;
      position: relative;
      .title-container{
        font-family: '微软雅黑';
        font-size: 26px;
        color: #2b2b2b;
        line-height: 33px;
        position: relative;
        top: 45px;
        left: 57px;       
      }
      .changTypeButton{
        position: absolute;
        top: 45px;
        right: 57px;
        font-size: 24px;
        height: 33px;
        line-height: 33px;
        color: $bg;
        cursor: pointer;
      }
      .mobile-form{
        width: 388px;
        height: 88px;
        position: absolute;
        top: 128px;
        left: 57px;
        input{
          width: 388px;
          height: 58px;        
          &.el-input__inner{
            padding-left: 55px;
          }
        }
      }
      .pwsd-from{
        width: 388px;
        height: 88px;
        position: absolute;
        top: 216px;
        left: 57px;
        input{
          width: 388px;
          height: 58px;        
          &.el-input__inner{
            padding-left: 55px;
          }
        }
      }
      .code-form{
        width: 388px;
        height: 88px;
        position: absolute;
        top: 304px;
        left: 57px;
        input{
          width: 234px;
          height: 58px;   
        }
        .show-verifyCode{
          display: inline-block;
          width: 144px;
          height: 58px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .text-form{
        width: 388px;
        height: 88px;
        position: absolute;
        top: 258px;
        left: 57px;
        input{
          width: 388px;
          height: 58px; 
          &.el-input__inner{
            padding-left: 55px;
            padding-right: 53px;
          } 
        }
        .show-pwd{
          position: absolute;
          top: 0;
          right: 0;
          font-size: 26px;
          .el-button{
            height: 58px;
          }
        }
      }
      .input-icon{
        width: 26px;
        height: 24px;
        margin: 17px 10px;
        position: absolute;
        z-index: 99999;
        color: #888888;
      }
      .loading{
        width: 388px;
        height: 50px;
        position: absolute;
        top: 392px;
        left: 57px;
      }
      .forgetPswd{
        position: absolute;
        top: 442px;
        right: 57px;
        color: #2b2b2b;
      }
    }
  }
}

</style>
