<template>
  <div class="login-container">
    <el-form ref="forgetPassword" :model="forgetPasswordForm" :rules="forgetPasswordRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">忘记密码</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="forgetPasswordForm.username"
          placeholder="请输入手机号"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="forgetPasswordForm.password"
          placeholder="请输入新密码"
          type="text"
          onfocus="this.type='password'"
          autocomplete = "off"
        />
      </el-form-item>

      <el-form-item prop="passwordAgain">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="passwordAgain"
          v-model="forgetPasswordForm.passwordAgain"
          placeholder="请再一次输入新密码"
          type="text"
          onfocus="this.type='password'"
          autocomplete = "off"
        />
      </el-form-item>

      <el-form-item prop="passwordNote">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input          
          v-model="forgetPasswordForm.passwordNote"
          placeholder="短信验证码"
        />

        <span class="show-pwd" @click="getMessage">
          <el-button type="primary" v-if = "messageTime === 0">获取短信</el-button>
          <el-button type="primary" v-else disabled>{{messageTime}}后再发送</el-button>
        </span>
      </el-form-item>

      <el-form-item prop="verifycode">
          <el-input placeholder="请输入验证码" type="text" v-model="forgetPasswordForm.verifycode"></el-input>
          <span id="verifyCode" class="show-verifyCode" @click="changeVerifyCode"></span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="confirm(forgetPasswordForm)">确定</el-button>

    </el-form>
  </div>
</template>

<script>
import { validateUsername,validatePassword, validatePasswordNote,validateVerifycode} from '@/utils/validate'
import { gVerify } from '@/api/gVerify'
import axios from 'axios'
import url from '@/api/api.js'

export default {
  name: 'forgetPassword',
  data() {
    var validatePasswordAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.forgetPasswordForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      forgetPasswordForm: {
        username: '',
        password: '',
        passwordAgain: '',
        passwordNote:'',
        verifycode:''
      },
      forgetPasswordRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }],
        passwordNote:[{ required: true, trigger: 'blur',validator: validatePasswordNote }],
        verifycode:[{ required: true, trigger: 'blur',validator: validateVerifycode }]
      },
      loading: false,
      messageTime : 0,
    }
  },
  mounted(){
    this.verifyCode = new GVerify("verifyCode");
  },
  methods: {
    confirm(forgetPasswordForm) {
        this.$refs.forgetPassword.validate((valid) => {
          if(valid){
            if(this.verifyCode.codeValidate(this.forgetPasswordForm.verifycode)){
              axios.post(url.forgetMessage,this.forgetPasswordForm).then((res)=>{
                if(res.status == 200){
                  this.$router.push({ name: 'login' })
                };
              }).catch((error)=>{
                console.log(error);
              })
            } else {
              this.$message('请输入正确的验证码')
            }
          }
        })
    },
    getMessage(){
      this.messageTime = 60;
      var timer = setInterval(()=>{
        this.messageTime--;
        if(this.messageTime == 0) clearInterval(timer)
      },1000)
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
