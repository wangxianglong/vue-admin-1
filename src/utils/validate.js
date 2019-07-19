/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// export function validUsername(str) {
//   const valid_map = ['admin', 'editor']
//   return valid_map.indexOf(str.trim()) >= 0
// }

export function validateUsername(rule,value, callback){
  setTimeout(()=> {
    if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  },100)

}

export function validatePassword(rule, value, callback){
  setTimeout(()=> {
    if (value.length == 0) {
      callback(new Error('请输入密码'))
    }
    if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
    }if (value.length > 16) {
      callback(new Error('密码不能大于16位'))
    }else {
        callback()
    }
  },100)
}

export function validatePasswordNote(rule, value, callback){
  setTimeout(()=> {
    if (value.length <= 0) {
        callback(new Error('短信验证码不能为空'))
    } else {
        callback()
    }
  },100)
}
export function validateVerifycode(rule, value, callback){
  setTimeout(()=> {
    if (value.length <= 0) {
        callback(new Error('验证码不能为空'))
    } else {
        callback()
    }
  },100)
}