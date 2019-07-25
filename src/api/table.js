import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getRosterList(params) {
  return request({
    url: '/table/roster',
    method: 'get',
    params
  })
}