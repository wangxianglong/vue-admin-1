let url = {
  userLogin: '/user/login', //账号密码登录
  userGetCode: '/user/getCode', //获取验证码
  userCodeLogin: '/user/codeLogin', //手机号码验证码登录
  userForgetPswd: '/user/forgetPswd', //忘记密码找回
  userLists: '/user', //查询B端职员
  userAdd: '/user', //添加新用户
  userForbidden: 'user/2', //禁用用户
  userList: 'user/1', //查看用户
}


//开发环境和真实环境的切换
// let host = ''
let host = ''

for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}

export default url
