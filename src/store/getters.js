export default {
  getStudent(state) {
    return JSON.parse(JSON.stringify(state.student))
  },
  getEnterprise(state) {
    return JSON.parse(JSON.stringify(state.enterprise))
  },
  getAdmin(state) {
    return JSON.parse(JSON.stringify(state.admin))
  },
}
