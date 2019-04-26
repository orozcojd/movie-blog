import Api from '@/services/Api'
import types from './types'

export default {

	async addUser({commit}, payload) {
		const response = (await Api().post('addUser', payload)).data
		return response
	},

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
	 * Commits mutation to set local storage item in store
	 * @param {commit} param0 
	 */
	getSetToken ({commit, dispatch}) {
		const token = localStorage.getItem('unsolicited-session-token')
		dispatch('getSetUser')
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
	 * Gets user name from local storage and sets it to state 
	 * @param {commit} param0 
	 */
	getSetUser ({commit}) {
		const user = JSON.parse(localStorage.getItem('unsolicited-user'))
		commit(types.SET_USER, user)
	},
	/**
	 * Calls api to GET all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async getTags ({commit}, options = {}) {
		let tags = (await Api().get('tags', options)).data
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
	 * @param {Array} payload 
	 */
	async postTags({commit}, payload) {
		let tags = (await Api().post('tags', payload)).data
		commit(types.ADD_TAGS, tags)
		console.log(tags)
		return tags
	},
	/**
	 * Calls api to PUT array of tags - updating
	 * names of tags in db and commiting to Vuex store
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async updateTags ({commit}, payload) {
		let tags = (await Api().put('tags', payload)).data
		console.log(tags)
		commit(types.FETCH_TAGS, tags.tags)
	},
	/**
	 * Calls api to DELETE array of tags 
	 * Vuex mutation called within component 
	 * to delete tags from state
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	deleteTags ({commit}, payload) {
		return new Promise(async (resolve, reject) => {
			let params = {
				data: payload
			}
			let deletedTags = (await Api().delete('tags', params)).data
			resolve(deletedTags.deleteCount)
			// await Api().delete('tags', params)
			// commit(types.REMOVE_TAG, deletedTags)
		}).catch(err => {
			console.log(err)
			reject(err)
		})
	},
	/**
	 * Commits mutation to convert state article tags & realms
	 * from names to IDs
	 * @param {commit} param0 
	 */
	prepareArticle({commit}) {
		commit(types.NEW_ARTICLE)
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
	 * Calls API to GET associated articles by tag, realms found in current
	 * article and commits payload to store
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async getNextArticles({commit, dispatch}, payload) {
		const params = {
			params: {
				tags: payload.article.tags,
				realm: payload.article.realm,
				id: payload.article._id,
				pageNo: payload.pageNo
			}}
		const nextArticles = (await Api().get('infinite-articles', params)).data
		if(nextArticles.message.length)
			commit(types.FETCH_NEXT_ARTICLES, nextArticles)
		else {
			dispatch('setMaxRelated', true)
		}
	},
	/**
	 * Commits mutation to toggle state variable to payload
	 * @param {commit} param0 
	 * @param {Boolean} payload 
	 */
	setMaxRelated({commit}, payload) {
		commit(types.MAX_RELATED_REACHED, payload)
	},
	/**
	 * Calls API to GET unrelated articles sorted by 
	 * created_at field and commits to store
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async getLatestUnrelated({commit}, payload) {
		let params = {
			params: {
				latestUnrelated: true,
				...payload
			}
		}
		const nextArticles = (await Api().get('infinite-articles', params)).data
		commit(types.FETCH_UNRELATED_ARTICLES, nextArticles)
	},
	/**
	 * Calls api to GET articles with associated tags 
	 * from tag param and commits mutation to set state articles array
	 * @param {commit} param0 
	 * @param {String} tag 
	 */
	async getArticlesByTag ({commit}, payload) {
		let articles = (await Api().get(`/tag/${payload.query}`, payload.params)).data
		commit(types.FETCH_BY_TAG, articles)
	},
	/**
	 * Calls api to update payload object article in db
	 * and commits mutation
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async updateArticle ({commit}, payload) {
		const article = (await Api({}).put(`articles/${payload.id}`, payload.article)).data
		commit(types.UPDATE_ARTICLE, article)
		return article.message
	},
	/**
	 * Calls api to POST new article and commits mutation to
	 * add new article to front of state array
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async postArticle ({commit}, payload) {
		// console.log(payload)
		const article = (await Api().post('article/', payload)).data
		commit(types.POST_ARTICLE, article)
		return article
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
	},
	async resetNextArticles({commit}) {
		commit(types.RESET_NEXT_ARTICLES)
	}
}
