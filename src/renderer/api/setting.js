import request from '@/utils/request'

export function openTool(data) {
  return request({
    url: '/openTool',
    method: 'post',
    data,
  })
}

export function getSetting() {
  return request({
    url: '/setting',
    method: 'get',
  })
}

export function message() {
  return request({
    url: '/message',
    method: 'get',
  })
}
