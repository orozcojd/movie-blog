import Api from '@/services/Api'
import types from './types'

export default {
  setToken ({commit}, token) {
    commit('setToken', token)
  },
  setUser ({commit}, user) {
    commit('setUser', user)
  },
  async getArticles ({commit}) {
    let articles = (await Api().get('articles')).data
    commit(types.FETCH_ARTICLES, articles)
  },
  async updateArticle ({commit}, payload) {
    let article = (await Api().put(`articles/:${payload._id}`, payload)).data
    commit(types.UPDATE_ARTICLE, article)
  },
  async postArticle ({commit}, payload) {
    let article = (await Api().post('article/', payload)).data
    commit(types.POST_ARTICLE, article)
  }
}
