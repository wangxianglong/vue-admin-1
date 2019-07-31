/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


//验证手机号
export function validatePhone(rule,value, callback){
  if (value.length == 0) {
    callback(new Error('手机号不能为空'))
  } else {
    setTimeout(()=> {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    },500)
  }

}

//验证密码
export function validatePassword(rule, value, callback){
  if (value.length == 0) {
    callback(new Error('请输入密码'))
  } else {
    setTimeout(()=> {
      if(!(/^\w{6,16}$/.test(value))){
        callback(new Error('密码位数6~16之间，只能包含字母、数字和下划线'))
      } else{
        callback()
      }
    },500)
  }
}

export function validateNewPassword(rule, value, callback){
  if (value.length == 0) {
    callback(new Error('请输入新密码'))
  } else {
    setTimeout(()=> {
      if(!(/^\w{6,16}$/.test(value))){
        callback(new Error('密码位数6~16之间，只能包含字母、数字和下划线'))
      } else{
        callback()
      }
    },500)
  }
}

//验证短信验证码
export function validatePasswordNote(rule, value, callback){
  if (value.length <= 0) {
    callback(new Error('短信验证码不能为空'))
  } else {
    setTimeout(()=> {
      if (value.length != 6) {
        callback(new Error('请输入正确的6位短信验证码'))
      } else{
          callback()
      }
    },500)
  }
}

//验证验证码
export function validateVerifycode(rule, value, callback){
  if (value.length <= 0) {
      callback(new Error('验证码不能为空'))
  } else {
    setTimeout(()=> {
      if (value.length != 4) {
        callback(new Error('请输入正确的4位验证码'))
      } else{
          callback()
      }
    },500)
  }
}

//验证邮箱
export function validateMail(rule,value, callback){
  if (value.length == 0) {
    callback(new Error('邮箱不能为空'))
  } else {
    setTimeout(()=> {
      if (!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value))) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    },500)
  }

}