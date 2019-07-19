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
  'items|50': [{
    num: '@integer(0, 300)',
    id: '@id',
    name: '@sentence(2, 3)',
    phone: '@integer(11)',
    bank: 'name',
    idCard: '@integer(11)',
    bankCard: '@integer(12)',
    bank: '@sentence(2, 7)'
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
