import Mock from 'mockjs'

const data = Mock.mock({
  // 'items|30': [{
  //   id: '@id',
  //   title: '@sentence(10, 20)',
  //   'status|1': ['published', 'draft', 'deleted'],
  //   author: 'name',
  //   display_time: '@datetime',
  //   pageviews: '@integer(300, 5000)'
  // }]
  // 'items|50': [{
  //   'num|+1': 1,
  //   id: '@id',
  //   'name|2-3': '@string',
  //   phone: '@integer(11)',
  //   bank: 'name',
  //   idCard: '@integer(11)',
  //   bankCard: '@integer(12)',
  //   'bank|3-7': '@string',
  //   'status|1': ['stay', 'success', 'error']
  // }]
  'items|50': [{
    'num|+1': 1,
    'name': /[a-z]{2,3}/,
    'phone': /189\d{8}/,
    'mail': '@email',
    'createDate': '@date(yyyy-MM-dd)',
    'lastDate': '@date(yyyy-MM-dd)',
    'identity|1': ['管理员', '普通用户'],
    'state|1': ['正常', '禁用'],
    'pwd': /\w{6,16}/
  }]
})

export default [
  {
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
  }
]
