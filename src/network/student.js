import {request} from "./request";

//学生登录
export function getStudent(student) {
  return request({
    url: '/getStudent',
    method: 'post',
    data: student
  })
}

//检查用户名重复
export function checkStudent(student) {
  return request({
    url: '/checkStudent',
    method: 'post',
    data: student
  })
}

//学生注册
export function insertStudent(student) {
  return request({
    url: '/insertStudent',
    method: 'post',
    data: student
  })
}

//学生信息修改
export function updateStudent(student) {
  return request({
    url: '/updateStudent',
    method: 'post',
    data: student
  })
}

//查看全部学生
export function students() {
  return request({
    url: '/students',
  })
}

//查看一个学生
export function student(id) {
  return request({
    url: '/student',
    params: {
      id,
    }
  })
}

//删除一个学生
export function deleteStudent(id, username) {
  return request({
    url: '/deleteStudent',
    params: {
      id,
      username,
    }
  })
}
