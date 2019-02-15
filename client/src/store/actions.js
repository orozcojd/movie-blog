module.exports = {
  setToken ({commit}, token) {
    commit('setToken', token)
  },
  setUser ({commit}, user) {
    commit('setUser', user)
  }
}
