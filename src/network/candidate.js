import {request} from "./request";

//检查重复申请职位
export function checkCandidate(candidate) {
  return request({
    url: '/checkCandidate',
    method: 'post',
    data: candidate
  })
}

//申请职位
export function insertCandidate(candidate) {
  return request({
    url: '/insertCandidate',
    method: 'post',
    data: candidate
  })
}

//修改申请状态和面试信息
export function updateCandidate(candidate) {
  return request({
    url: '/updateCandidate',
    method: 'post',
    data: candidate
  })
}

//根据职位查看职位申请
export function byJob(id) {
  return request({
    url: '/candidateByJob',
    params: {
      id,
    }
  })
}

//根据学生查看职位申请
export function byStudent(id) {
  return request({
    url: '/candidateByStudent',
    params: {
      id,
    }
  })
}

//根据公司查看职位申请
export function byEnterprise(id) {
  return request({
    url: '/candidateByEnterprise',
    params: {
      id,
    }
  })
}
