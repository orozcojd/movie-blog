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
  },
  [types.POST_ARTICLE] (state, payload) {
    console.log('mutating state')
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
    console.log('after delete article mutation')
  }
}
