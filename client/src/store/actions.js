import Api from '@/services/Api'
import types from './types'

export default {
  setToken ({commit}, token) {
    commit(types.SET_TOKEN, token)
  },
  setUser ({commit}, user) {
    commit(types.SET_USER, user)
  },
  getSetToken ({commit}) {
    const token = localStorage.getItem('session-token')
    commit(types.SET_TOKEN, token)
  },
  async fetchArticle ({commit}, id) {
    let article = (await Api().get(`articles/${id}`)).data
    commit(types.FETCH_ARTICLE, article)
  },
  async getArticles ({commit}) {
    let articles = (await Api().get('articles')).data
    commit(types.FETCH_ARTICLES, articles)
  },
  async updateArticle ({commit}, payload) {
    let article = (await Api().put(`articles/${payload.id}`, payload.article)).data
    commit(types.UPDATE_ARTICLE, article)
  },
  async postArticle ({commit}, payload) {
    console.log(payload)
    let article = (await Api().post('article/', payload)).data
    commit(types.POST_ARTICLE, article)
  },
  async deleteArticle ({commit}, payload) {
    let deleteCount = (await Api().delete(`article/${payload}`, payload)).data
    commit(types.DELETE_ARTICLE, deleteCount)
  }
}
