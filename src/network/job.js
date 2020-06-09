import {request} from "./request";

//职位信息发布
export function insertJob(job) {
  return request({
    url: '/insertJob',
    method: 'post',
    data: job
  })
}

//职位信息修改
export function updateJob(job) {
  return request({
    url: '/updateJob',
    method: 'post',
    data: job
  })
}

//查看全部职位
export function jobs(name, type, area, skip) {
  return request({
    url: '/jobs',
    params: {
      name,
      type,
      area,
      skip,
    }
  })
}

//查看职位总数
export function countJobs() {
  return request({
    url: '/countJobs',
  })
}

//查看一个职位
export function getJob(id) {
  return request({
    url: '/getJob',
    params: {
      id,
    }
  })
}

//删除一个职位
export function deleteJob(id) {
  return request({
    url: '/deleteJob',
    params: {
      id,
    }
  })
}
