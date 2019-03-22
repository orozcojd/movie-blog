import Api from '@/services/Api'
import types from './types'

export default {
	/**
	 * Logs in user if validated by backend and
	 * Commits result to store
	 * @param {commit, dispatch} param0 
	 * @param {object} payload 
	 */
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
	/**
	 * Commits mutations to set token and user to null
	 * @param {commit, dispatch} param0 
	 */
	logOut({commit, dispatch}) {
		return new Promise((resolve) => {
			commit(types.AUTH_ERR)
			dispatch('setToken', null)
			dispatch('setUser', null)
			resolve()
		})
	},
	/**
	 * Commits mutation to set state token to param token
	 * @param {commit} param0 
	 * @param {String} token 
	 */
	setToken ({commit}, token) {
		commit(types.SET_TOKEN, token)
	},
	/**
	 * Commits mutations to set user to param user
	 * @param {commit} param0 
	 * @param {Object} user 
	 */
	setUser ({commit}, user) {
		commit(types.SET_USER, user)
	},
	/**
	 * Commits mutation to set local storage item in store
	 * @param {commit} param0 
	 */
	getSetToken ({commit}) {
		const token = localStorage.getItem('session-token')
		commit(types.SET_TOKEN, token)
	},
	/**
	 * Commits mutation to set state article attribute to payload param
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	updateArticleContent ({commit}, payload) {
		commit(types.UPDATE_ARTICLE_CONTENT, payload)
	},
	/**
	 * Commits mutation to set state article to article param
	 * @param {commit} param0 
	 * @param {Object} article 
	 */
	setSingleArticle ({commit}, article) {
		commit(types.SET_SINGLE_ARTICLE, article)
	},
	/**
	 * Calls api to GET article by id and commits mutation 
	 * to set state article to article retrieved
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticle ({commit}, id) {
		let article = (await Api().get(`articles/${id}`)).data
		commit(types.FETCH_ARTICLE, article)
	},
	/**
	 * Calls api to GET articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async getArticles ({commit}) {
		let articles = (await Api().get('articles')).data		
		commit(types.FETCH_ARTICLES, articles)
	},
	/**
	 * Calls api to GET all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async getTags ({commit}) {
		let tags = (await Api().get('tags')).data
		commit(types.FETCH_TAGS, tags)
	},
	/**
	 * Commits mutation to set state tag object to payload tag
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async setTag ({commit}, payload) {
		commit(types.SET_TAG, payload)
	},
	/**
	 * Calls api to POST array of tags 
	 * TODO: Commit mutation to set state tagd array to retrieved result
	 * @param {commit} param0 
	 * @param {array} payload 
	 */
	async postTags({commit}, payload) {
		console.log(payload)
		let tags = (await Api().post('tags')).data
		console.log(tags)
	},
	/**
	 * Calls api to GET articles with associated tags 
	 * from tag param and commits mutation to set state articles array
	 * @param {commit} param0 
	 * @param {String} tag 
	 */
	async getArticlesByTag ({commit}, tag) {
		let articles = (await Api().get(`/tag/${tag}`)).data
		commit(types.FETCH_BY_TAG, articles)
	},
	/**
	 * Calls api to update payload object article in db
	 * and commits mutation
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async updateArticle ({commit}, payload) {
		let article = (await Api({}).put(`articles/${payload.id}`, payload.article)).data
		commit(types.UPDATE_ARTICLE, article)
	},
	/**
	 * Calls api to POST new article and commits mutation to
	 * add new article to front of state array
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async postArticle ({commit}, payload) {
		// console.log(payload)
		let article = (await Api().post('article/', payload)).data
		commit(types.POST_ARTICLE, article)
	},
	/**
	 * Calls api to delete article by id passed in and commits
	 * mutation to remove from state array by returned index value
	 * @param {commit} param0 
	 * @param {String} payload 
	 */
	async deleteArticle ({commit}, payload) {
		let deleteCount = (await Api().delete(`article/${payload}`, payload)).data
		commit(types.DELETE_ARTICLE, deleteCount)
	}
}
