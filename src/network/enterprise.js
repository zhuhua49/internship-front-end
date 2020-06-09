import {request} from "./request";

//企业登录
export function getEnterprise(enterprise) {
  return request({
    url: '/getEnterprise',
    method: 'post',
    data: enterprise
  })
}

//检查用户名重复
export function checkEnterprise(enterprise) {
  return request({
    url: '/checkEnterprise',
    method: 'post',
    data: enterprise
  })
}

//企业注册
export function insertEnterprise(enterprise) {
  return request({
    url: '/insertEnterprise',
    method: 'post',
    data: enterprise
  })
}

//企业信息修改
export function updateEnterprise(enterprise) {
  return request({
    url: '/updateEnterprise',
    method: 'post',
    data: enterprise
  })
}

//查看全部企业
export function enterprises() {
  return request({
    url: '/enterprises',
  })
}

//查看一个企业
export function enterprise(id) {
  return request({
    url: '/enterprise',
    params: {
      id,
    }
  })
}

//删除一个公司
export function deleteEnterprise(id, username) {
  return request({
    url: '/deleteEnterprise',
    params: {
      id,
      username,
    }
  })
}

