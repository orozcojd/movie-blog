import Api from '@/services/Api'
import types from './types'

export default {
	login({commit, dispatch}, payload) {
		return new Promise((resolve, reject) => {
			commit(types.AUTH_REQUEST)
			Api().post('login', payload).then(res => {
				commit(types.AUTH_SUCCESS)
				dispatch('setToken', res.data.token)
				dispatch('setUser', res.data.user)
				resolve()
			}).catch(err => {
				commit(types.AUTH_ERR)
				reject(err)
			})
		})
	},
	logOut({commit, dispatch}) {
		return new Promise((resolve) => {
			commit(types.AUTH_ERR)
			dispatch('setToken', null)
			dispatch('setUser', null)
			resolve()
		})
	},
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
		let article = (await Api({}).put(`articles/${payload.id}`, payload.article)).data
		commit(types.UPDATE_ARTICLE, article)
	},
	async postArticle ({commit}, payload) {
		// console.log(payload)
		let article = (await Api().post('article/', payload)).data
		commit(types.POST_ARTICLE, article)
	},
	async deleteArticle ({commit}, payload) {
		let deleteCount = (await Api().delete(`article/${payload}`, payload)).data
		commit(types.DELETE_ARTICLE, deleteCount)
	}
}
