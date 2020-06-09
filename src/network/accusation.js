import {request} from "./request";

//检查重复举报
export function checkAccusation(accusation) {
  return request({
    url: '/checkAccusation',
    method: 'post',
    data: accusation
  })
}

//新建举报
export function insertAccusation(accusation) {
  return request({
    url: '/insertAccusation',
    method: 'post',
    data: accusation
  })
}

//查看职位举报
export function toJob() {
  return request({
    url: '/accusationToJob',
  })
}

//查看求职者举报
export function toStudent() {
  return request({
    url: '/accusationToStudent',
  })
}

//查看公司举报
export function toEnterprise() {
  return request({
    url: '/accusationToEnterprise',
  })
}

//删除一个举报
export function deleteAccusation(id) {
  return request({
    url: '/deleteAccusation',
    params: {
      id,
    }
  })
}
