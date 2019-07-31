<template>
  <div class="forgetPwsd-container">
    <div class="forgetPwsd-content">
      <div class="forgetPwsd-icon">
        <svg-icon icon-class="logo" class="logo-icon"/>
      </div>
      <div class="forgetPwsd">
        <el-form ref="forgetPassword" :model="forgetPasswordForm" :rules="forgetPasswordRules" class="login-form" auto-complete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">忘记密码</h3>
          </div>

          <el-form-item prop="username" class="mobile-form">
            <span class="svg-container">
              <svg-icon icon-class="mobile" class="input-icon"/>
            </span>
            <el-input
              ref="username"
              v-model="forgetPasswordForm.username"
              placeholder="请输入手机号"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              onKeyUp = "this.value=this.value.replace(/[^\d]/g,'')"
              clearable
            />
          </el-form-item>

          <el-form-item prop="passwordNote" class="text-form">
            <span class="svg-container">
              <svg-icon icon-class="password" class="input-icon"/>
            </span>
            <el-input          
              v-model="forgetPasswordForm.passwordNote"
              placeholder="短信验证码"
              onKeyUp = "this.value=this.value.replace(/[^\d]/g,'')"
              clearable
            />

            <span class="show-pwd" @click="getMessage">
              <el-button type="primary" v-if = "messageTime === 0">获取短信</el-button>
              <el-button type="primary" v-else disabled>{{messageTime}}后再发送</el-button>
            </span>
          </el-form-item>

          <el-form-item prop="password" class="pwsd-from">
            <span class="svg-container">
              <svg-icon icon-class="password" class="input-icon"/>
            </span>
            <el-input
              ref="password"
              v-model="forgetPasswordForm.password"
              placeholder="请输入新密码"
              type="text"
              onfocus="this.type='password'"
              autocomplete = "off"
              clearable
            />
          </el-form-item>

          <el-button :loading="loading" type="primary" class="loading" @click.native.prevent="confirm(forgetPasswordForm)">确定</el-button>
          <router-link to="/login">
              <el-button type="text" class="login">去登陆</el-button>
          </router-link>

        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validatePhone,validateNewPassword, validatePasswordNote} from '@/utils/validate'
import url from '@/api/api.js'

export default {
  name: 'forgetPassword',
  data() {
    return {
      forgetPasswordForm: {
        username: '15716597991',
        password: '123456',
        passwordNote:'123456',
      },
      forgetPasswordRules: {
        username: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        passwordNote:[{ required: true, trigger: 'blur',validator: validatePasswordNote }],
      },
      loading: false,
      messageTime : 0,
    }
  },
  mounted(){
  },
  methods: {
    confirm(forgetPasswordForm) {
        this.$refs.forgetPassword.validate((valid) => {
          if(valid){
            this.$axios.post(url.userForgetPswd,{
                mobile:this.forgetPasswordForm.username,
                code:this.forgetPasswordForm.passwordNote,
                pswd:this.forgetPasswordForm.password
            }).then((res)=>{
              console.log(res);
              if(res.status == 200){
                this.$router.push({ name: 'login' })
              };
            }).catch((error)=>{
              console.log(error);
            })
          }
        })
    },
    getMessage(){
      if(/^1[3456789]\d{9}$/.test(this.forgetPasswordForm.username)){
        if(this.messageTime > 0) return;
        this.messageTime = 60;
        var timer = setInterval(()=>{
          this.messageTime--;
          if(this.messageTime <= 0) {
            clearInterval(timer)
            this.messageTime = 0;
          }
        },1000)
        this.$axios.get(url.userGetCode,{
          params:{
            mobile:this.forgetPasswordForm.username
          }
        }).then((res)=>{
          console.log(res);
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
  }
}
</script>

<style lang="scss">
$bg:#0091FF;
.forgetPwsd-container{
  width: 100%;
  height: 100%;
  background-color: $bg;
  position: relative;
  .forgetPwsd-content{
    width: 970px;
    height: 540px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .forgetPwsd-icon{
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
    .forgetPwsd{
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
      .text-form{
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
      .pwsd-from{
        width: 388px;
        height: 88px;
        position: absolute;
        top: 304px;
        left: 57px;
        input{
          width: 388px;
          height: 58px;        
          &.el-input__inner{
            padding-left: 55px;
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
      .login{
        position: absolute;
        top: 442px;
        right: 57px;
        color: #2b2b2b;
      }
    }
    
  }
}

</style>
