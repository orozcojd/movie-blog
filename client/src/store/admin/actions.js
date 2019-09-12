import Api from '@/services/Api'
import types from '@/store/types'
import to from '@/store/to'

export default {
	/**
	 * Commits mutation to set state article to
	 * equal to payload
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	setArticle ({commit}, payload) {
		commit(types.SET_ARTICLE, payload)
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
	clearArticle ({commit}) {
		commit(types.CLEAR_ARTICLE)
	},
	
	/**
	 * Commits mutation to set vuex snackbar to value in payload
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	setSnackbar({commit}, payload) {
		commit(types.SET_SNACKBAR, payload)
	},
	async postArticle ({commit, dispatch}, payload) {
		const [err, article] = await to(Api.ApiAdmin().post('/api/articles/', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.POST_ARTICLE, article.data)
			dispatch('setSnackbar', {
				type: 'text',
				value: article.data.message,
				show: true
			})
		}
	},
	/**
	 * PUT
	 * Calls api to update payload object article in db
	 * and commits mutation
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async updateArticle ({commit, dispatch}, payload) {
		const [err, article] = await to(Api.ApiAdmin().put(`/api/articles/${payload.id}`, payload.article))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.UPDATE_ARTICLE, article.data)
			dispatch('setSnackbar', {
				type: 'text',
				value: article.data.message,
				show: true
			})
		}
	},
	/**
	 * Calls API to post user detail data and returns reponse
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async addUser({commit, dispatch}, payload) {
		const [err, response] = await to(Api.ApiAdmin().post('/api/addUser', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			dispatch('setSnackbar', {
				type: 'text',
				value: response.data.message,
				show: true
			})
		}
	},
	/**
	 * GET
	 * Calls api to get all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async fetchTags ({commit, dispatch}, options = {}) {
		const [err, data] = await to(Api.ApiAdmin().get('/tags', options))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
		}
		else {
			commit(types.SET_TAGS, data.data)
		}
	},
	/**
	 * POST
	 * Calls api to post array of tags 
	 * TODO: Commit mutation to set state tagd array to retrieved result
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async postTags({commit, dispatch}, payload) {
		const [err, tags] = await to(Api.ApiAdmin().post('/api/tags', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.ADD_TAGS, tags.data)
			dispatch('setSnackbar', {
				type: 'text',
				value: tags.data.message,
				show: true
			})
		}
	},
	/**
	 * PUT
	 * Calls api to put array of tags - updating
	 * names of tags in db and commiting to Vuex store
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async updateTags ({commit, dispatch}, payload) {
		let [err, tags] = await to(Api.ApiAdmin().put('/api/tags', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.SET_TAGS, tags.data.tags)
			dispatch('setSnackbar', {
				type: 'text',
				value: tags.data.message,
				show: true
			})
		}
	},
	/**
	 * DELETE
	 * Calls api to delete array of tags 
	 * Vuex mutation called within component 
	 * to delete tags from state
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async deleteTags ({commit, dispatch}, payload) {
		let params = {
			data: payload
		}
		const [err, res] = await to(Api.ApiAdmin().delete('/api/tags', params))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.REMOVE_TAG, res.data)
			dispatch('setSnackbar', {
				type: 'text',
				value: `Deleted the ${res.data.deleteCount} tag(s) selected.`,
				show: true
			})
		}
	},
	/**
	 * GET
	 * Calls api to get article if current logged in user is contributor
	 * to the article. Commits mutation to set article object in store
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticleApi ({commit, dispatch}, id) {
		const [err, article] = await to(Api.ApiAdmin().get(`/api/articles/${id}`))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.FETCH_ARTICLE, article.data)
			return article.data
		}
	},

	/**
	 * GET
	 * Calls api to get articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async fetchArticlesApi ({commit, dispatch}, payload) {
		const [err, articles] = await to(Api.ApiAdmin().get('/api/articles', payload.params))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.FETCH_ARTICLES, articles.data)
			return articles.data
		}
	},
	
	/**
	 * DELETE
	 * Calls api to delete article by id passed in and commits
	 * mutation to remove from state array by returned index value
	 * @param {commit} param0 
	 * @param {String} payload 
	 */
	async deleteArticle ({commit, dispatch}, payload) {
		const [err, deleteCount] = await to(Api.ApiAdmin().delete(`/api/articles/${payload}`, payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.DELETE_ARTICLE, deleteCount.data)
			return deleteCount.data
		}
	}
}