import {request} from "./request";

//管理员登录
export function getAdmin(admin) {
  return request({
    url: '/getAdmin',
    method: 'post',
    data: admin
  })
}

//检查用户名重复
export function checkAdmin(admin) {
  return request({
    url: '/checkAdmin',
    method: 'post',
    data: admin
  })
}

//添加管理员
export function insertAdmin(admin) {
  return request({
    url: '/insertAdmin',
    method: 'post',
    data: admin
  })
}

//查看一个管理员
export function admin(id) {
  return request({
    url: '/admin',
    params: {
      id,
    }
  })
}

//查看全部管理员
export function admins() {
  return request({
    url: '/admins',
  })
}

//删除一个管理员
export function deleteAdmin(id) {
  return request({
    url: '/deleteAdmin',
    params: {
      id,
    }
  })
}
