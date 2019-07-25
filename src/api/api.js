let url = {
    userLogin: '/user/login',
    userGetCode: '/user/getCode',
    userCodeLogin: '/user/codeLogin',
    userForgetPswd: '/user/forgetPswd'

}


//开发环境和真实环境的切换
// let host = ''
// let host = 'http://192.168.3.25:8080'
let host = ''

for (let key in url) {
    if (url.hasOwnProperty(key)) {
        url[key] = host + url[key]
    }
}

export default url