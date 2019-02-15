module.exports = {
  setToken (state, token) {
    state.token = token
    if (token) {
      state.isUserLoggedIn = true
    } else {
      state.isUserLoggedIn = false
    }
  },
  setUser (state, user) {
    state.user = user
  }
}
