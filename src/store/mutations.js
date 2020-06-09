export default {
  setStudent(state, payload) {
    if (typeof (payload.area) == 'string' && payload.area !== '') {
      payload.area = payload.area.split("-");
    }
    state.student = JSON.parse(JSON.stringify(payload));
  },
  setEnterprise(state, payload) {
    if (typeof (payload.area) == 'string' && payload.area !== '') {
      payload.area = payload.area.split("-");
    }
    state.enterprise = JSON.parse(JSON.stringify(payload))
  },
  setAdmin(state, payload) {
    state.admin = JSON.parse(JSON.stringify(payload))
  },
}
