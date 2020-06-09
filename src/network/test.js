import {request} from "./request";

export function getTest() {
  return request({
    url: '/getTest'
  })
}

export function insertTest(test) {
  return request({
    url: '/insertTest',
    method: 'post',
    data: test
  })
}
