let url = {
  userLogin: '/user/login', //账号密码登录
  userGetCode: '/user/getCode', //获取验证码
  userCodeLogin: '/user/codeLogin', //手机号码验证码登录
  userForgetPswd: '/user/forgetPswd', //忘记密码找回
  userLists: '/user/findUser', //查询B端职员
  userAdd: '/user', //添加新用户
  userForbidden: 'user/2', //禁用用户
  userEdit: 'user/1', //编辑用户
  rosterLists: 'roster', //花名册查询
  rosterAdd: 'roster', //花名册添加
  rosterImportExcel: 'roster/importExcel', //导入exel文件
  rosterDelete: 'roster/delete', //花名册删除
  rosterDeleteAll: 'roster/deleteAll', //花名册全部删除
  rosterEdit: 'roster/1', //花名册编辑
  rosterFilter: 'roster/groupRoster',
  rosterSearch: 'roster/fuzzyRoster',
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
