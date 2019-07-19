let url = {
    forgetMessage: '/forgetMessage',
}


//开发环境和真实环境的切换
// let host = ''
let host = 'https://easy-mock.com/mock/5d315834715b4c4113f7f6e9/login'

for (let key in url) {
    if (url.hasOwnProperty(key)) {
        url[key] = host + url[key]
    }
}

export default url