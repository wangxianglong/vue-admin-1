/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


//验证手机号
export function validateUsername(rule,value, callback){
  setTimeout(()=> {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  },1000)

}

//验证密码
export function validatePassword(rule, value, callback){
  if (value.length == 0) {
    callback(new Error('请输入密码'))
  } else {
    setTimeout(()=> {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else if (value.length > 16) {
        callback(new Error('密码不能大于16位'))
      } else {
          callback()
      }
    },1000)
  }
}

//验证短信验证码
export function validatePasswordNote(rule, value, callback){
  if (value.length <= 0) {
    callback(new Error('短信验证码不能为空'))
  } else {
    setTimeout(()=> {
      if (value.length != 6) {
        callback(new Error('请输入正确的短信验证码'))
      } else{
          callback()
      }
    },1000)
  }
}

//验证验证码
export function validateVerifycode(rule, value, callback){
  if (value.length <= 0) {
      callback(new Error('验证码不能为空'))
  } else {
      callback()
  }
}