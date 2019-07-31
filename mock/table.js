import Mock from 'mockjs'

const data = Mock.mock({
  'items|50': [{
    'customerId|+1': 1,
    'fullName': /[a-z]{2,3}/,
    'mobile': /189\d{8}/,
    'eMail': '@email',
    'createDate': '@date(yyyy-MM-dd)',
    'lastDate': '@date(yyyy-MM-dd)',
    'roles|1': ['管理员', '普通用户'],
    'isForbidden|1': [0, 1],
    'pswd': /\w{6,16}/
  }]
})

const rosterData = Mock.mock({

  'items|50': [{
    'num|+1': 1,
    'id': '@id',
    'name': /[a-zA-Z]{4,11}/,
    'sex': ['男', '女'],
    'phone': /157\d{8}/,
    'cardType': '身份证',
    'bank': /[a-zA-Z]{11}/,
    'idCard': /\d{18}/,
    'bankCard': /62\d{8}/,
    'bank': /[a-zA-Z]{4,11}/,
    'status|1': ['stay', 'success', 'error'],
    'type|1': ['经理', '出纳', '财务'],
    'state|1': ['forbidden', 'success'],
  }]
})

export default [{
    url: '/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/table/roster',
    type: 'get',
    response: config => {
      const items = rosterData.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
