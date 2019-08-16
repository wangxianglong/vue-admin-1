import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

//获取验证码
export function getCode(mobile) {
  return request({
    url: '/user/getCode',
    method: 'get',
    params: {
      mobile
    }
  })
}
//手机号码验证码登录
export function LoginByMessage(params) {
  return request({
    url: '/user/codeLogin',
    method: 'get',
    params
  })
}

//账号密码登录
export function LoginByPswd(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
//忘记密码找回
export function forgetPswd(data) {
  return request({
    url: '/user/forgetPswd',
    method: 'post',
    data
  })
}

//查询B端职员
export function getUserLists(params) {
  return request({
    url: '/user/findUser',
    method: 'get',
    params
  })
}

//添加新用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

//修改用户状态
export function updateStatus(data) {
  return request({
    url: '/user/updateStatus',
    method: 'post',
    data
  })
}

//编辑用户
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
