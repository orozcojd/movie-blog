import types from './types'
import Vue from 'vue'
export default {
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
  },
  [types.FETCH_ARTICLES] (state, payload) {
    /*
      sets articles array to payload
    */
    state.articles = payload
  },
  [types.UPDATE_ARTICLE] (state, payload) {
    /*
      finds the index of matching _id in articles array and updates value
      at that index with payload
    */
    let index = state.articles.findIndex(article => article._id === payload.article._id)
    Vue.set(state.articles, index, payload.article)
  }
}
