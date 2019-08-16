<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-icon">
        <svg-icon icon-class="logo" class="logo-icon" />
      </div>
      <div class="login">
        <el-form
          ref="loginBySMS"
          :model="loginBySMSForm"
          :rules="loginBySMSRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
          v-show="loginType === 'message'"
        >
          <div class="title-container">手机快捷登录</div>
          <div type="text" @click="changeLoginType" class="changTypeButton">
            {{loginType === "message" ? '账号密码登录' : '手机快捷登录'}}
            <svg-icon icon-class="arrow" />
          </div>
          <el-form-item prop="mobile" class="mobile-form">
            <span class="svg-container">
              <svg-icon icon-class="mobile" class="input-icon" />
            </span>
            <el-input
              ref="SMSUsername"
              v-model="loginBySMSForm.mobile"
              placeholder="请输入用户手机号"
              name="SMSUsername"
              type="text"
              clearable
            />
          </el-form-item>
          <el-form-item prop="code" class="text-form">
            <span class="svg-container">
              <svg-icon icon-class="password" class="input-icon" />
            </span>
            <el-input
              ref="passwordNote"
              v-model="loginBySMSForm.code"
              placeholder="请输入短信验证码"
              name="code"
              clearable
            />
            <span class="show-pwd" @click="getSMS">
              <el-button type="primary" v-if="messageTime === 0">获取短信</el-button>
              <el-button type="primary" v-else disabled>{{messageTime}}后再发送</el-button>
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="loading"
            @click.native.prevent="handleLogin"
          >登录</el-button>
          <router-link to="/forgetPassword">
            <el-button type="text" class="forgetPswd">忘记密码?</el-button>
          </router-link>
        </el-form>
        <el-form
          ref="loginByPassword"
          :model="loginByPasswordForm"
          :rules="loginByPasswordRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
          v-show="loginType === 'password'"
        >
          <div class="title-container">账号密码登录</div>

          <div type="text" @click="changeLoginType" class="changTypeButton">
            {{loginType === "message" ? '账号密码登录' : '手机快捷登录'}}
            <svg-icon icon-class="arrow" />
          </div>

          <el-form-item prop="mobile" class="mobile-form">
            <span class="svg-container icon">
              <svg-icon icon-class="mobile" class="input-icon" />
            </span>
            <el-input
              ref="passwordUsername"
              v-model="loginByPasswordForm.mobile"
              placeholder="请输入手机号"
              name="passwordUsername"
              type="text"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password" v-show="loginType === 'password'" class="pwsd-from">
            <span class="svg-container">
              <svg-icon icon-class="password" class="input-icon" />
            </span>
            <el-input
              ref="password"
              v-model="loginByPasswordForm.password"
              placeholder="请输入密码"
              name="password"
              type="text"
              onfocus="this.type='password'"
              autocomplete="off"
              clearable
            />
          </el-form-item>

          <el-form-item prop="verifycode" v-show="loginType === 'password'" class="code-form">
            <el-input
              ref="verifycode"
              placeholder="请输入验证码"
              type="text"
              v-model="loginByPasswordForm.verifycode"
              clearable
            ></el-input>
            <span id="verifyCode" class="show-verifyCode" @click="changeVerifyCode"></span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="loading"
            @click.native.prevent="handleLogin"
          >登录</el-button>
          <router-link to="/forgetPassword">
            <el-button type="text" class="forgetPswd">忘记密码?</el-button>
          </router-link>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  validatePhone,
  validatePassword,
  validatePasswordNote,
  validateVerifycode
} from "@/utils/validate";
import { gVerify } from "@/api/gVerify";
import { Toast, Message } from "element-ui";
import url from "@/api/api.js";
import axios from "axios";
import { getCode } from "@/api/user";

import { mapMutations, mapActions } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      loginBySMSForm: {
        mobile: "15716597991",
        code: "111111"
      },
      loginByPasswordForm: {
        mobile: "15716597991",
        password: "",
        verifycode: ""
      },
      loginBySMSRules: {
        mobile: [{ required: true, trigger: "blur", validator: validatePhone }],
        code: [
          { required: true, trigger: "blur", validator: validatePasswordNote }
        ]
      },
      loginByPasswordRules: {
        mobile: [{ required: true, trigger: "blur", validator: validatePhone }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        verifycode: [
          { required: true, trigger: "blur", validator: validateVerifycode }
        ]
      },
      loginType: "password",
      loading: false,
      messageTime: 0,
      timer: null,
      redirect: undefined
    };
  },
  mounted() {
    this.verifyCode = new GVerify("verifyCode");
    this.verifyCode.options.id = "verifyCode";
  },
  methods: {
    handleLogin() {
      if (this.loginType === "message") {
        this.$refs["loginBySMS"].validate(valid => {
          if (valid) {
            this.$store
              .dispatch("user/LoginByMessage", this.loginBySMSForm)
              .then(res => {
                console.log(res);
                this.login();
              });
          }
        });
      } else {
        this.$refs["loginByPassword"].validate(valid => {
          if (valid) {
            if (
              this.verifyCode.codeValidate(this.loginByPasswordForm.verifycode)
            ) {
              this.$store
                .dispatch("user/LoginByPswd", {
                  usuMobile: this.loginByPasswordForm.mobile,
                  usuPswd: this.loginByPasswordForm.password
                })
                .then(res => {
                  this.login();
                });
            } else {
              this.$message("请输入正确的验证码");
              this.loginByPasswordForm.password = "";
              return false;
            }
          } else {
            return false;
          }
        });
      }
    },
    login() {
      this.loading = true;
      this.$router.push(this.redirect || "/");
      this.loading = false;
    },
    changeLoginType() {
      this.loginType = this.loginType === "message" ? "password" : "message";
      this.verifyCode.refresh();
    },
    getSMS() {
      if (/^1[3456789]\d{9}$/.test(this.loginBySMSForm.mobile)) {
        if (this.messageTime > 0) return;
        this.messageTime = 60;
        this.timer = setInterval(() => {
          this.messageTime--;
          if (this.messageTime <= 0) {
            clearInterval(this.timer);
            this.messageTime = 0;
          }
        }, 1000);
        getCode(this.loginBySMSForm.mobile).then(res => {
          Message(
            `已向您尾号${this.loginBySMSForm.mobile.substring(
              7,
              11
            )}的手机发送验证码`
          );
        });
      }
    },
    changeVerifyCode() {
      this.verifyCode.refresh();
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
$bg: #0091ff;

.login-container {
  width: 100%;
  height: 100%;
  background-color: $bg;
  position: relative;
  .login-content {
    width: 970px;
    height: 540px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .login-icon {
      width: 470px;
      height: 100%;
      background-color: $bg;
      opacity: 0.6;
      float: left;
      .logo-icon {
        height: 125px;
        width: 136px;
        position: absolute;
        top: 158px;
        left: 173px;
      }
    }
    .login {
      width: 500px;
      height: 100%;
      margin-left: 470px;
      position: relative;
      .title-container {
        font-family: "微软雅黑";
        font-size: 26px;
        color: #2b2b2b;
        line-height: 33px;
        position: relative;
        top: 45px;
        left: 57px;
      }
      .changTypeButton {
        position: absolute;
        top: 45px;
        right: 57px;
        font-size: 24px;
        height: 33px;
        line-height: 33px;
        color: $bg;
        cursor: pointer;
      }
      .mobile-form {
        width: 388px;
        height: 88px;
        position: absolute;
        top: 128px;
        left: 57px;
        input {
          width: 388px;
          height: 58px;
          &.el-input__inner {
            padding-left: 55px;
          }
        }
      }
      .pwsd-from {
        width: 388px;
        height: 88px;
        position: absolute;
        top: 216px;
        left: 57px;
        input {
          width: 388px;
          height: 58px;
          &.el-input__inner {
            padding-left: 55px;
          }
        }
      }
      .code-form {
        width: 388px;
        height: 88px;
        position: absolute;
        top: 304px;
        left: 57px;
        input {
          width: 234px;
          height: 58px;
        }
        .show-verifyCode {
          display: inline-block;
          width: 144px;
          height: 58px;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .text-form {
        width: 388px;
        height: 88px;
        position: absolute;
        top: 258px;
        left: 57px;
        input {
          width: 388px;
          height: 58px;
          &.el-input__inner {
            padding-left: 55px;
            padding-right: 53px;
          }
        }
        .show-pwd {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 26px;
          .el-button {
            height: 58px;
          }
        }
      }
      .input-icon {
        width: 26px;
        height: 24px;
        margin: 17px 10px;
        position: absolute;
        z-index: 99999;
        color: #888888;
      }
      .loading {
        width: 388px;
        height: 50px;
        position: absolute;
        top: 392px;
        left: 57px;
      }
      .forgetPswd {
        position: absolute;
        top: 442px;
        right: 57px;
        color: #2b2b2b;
      }
    }
  }
}
</style>
