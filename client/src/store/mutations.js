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
  [types.FETCH_ARTICLE] (state, payload) {
    /*
      sets article object in store to payload
    */
    state.article = payload
  },
  [types.UPDATE_ARTICLE] (state, payload) {
    /*
      finds the index of matching _id in articles array and updates value
      at that index with payload
    */
    let index = state.articles.findIndex(article => article._id === payload.article._id)
    if (index) {
      Vue.set(state.articles, index, payload.article)
    } else {
      state.articles.push(payload)
    }
  },
  [types.POST_ARTICLE] (state, payload) {
    /*
      unshifts new article to start of state articles array
    */
    state.articles.unshift(payload.article)
  },
  [types.DELETE_ARTICLE] (state, payload) {
    /*
      if response count, then removes index from state array otherwise returns
    */
    let count = payload.deleteCount.n
    if (!count) {
      return
    }
    let index = state.articles.findIndex(article => article._id === payload.id)
    Vue.delete(state.articles, index)
  }
}
