import Api from '@/services/Api'
import types from '@/store/types'


export default {
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

	async postArticle ({commit}, payload) {
		const article = (await Api.ApiAdmin().post('/api/articles/', payload)).data
		commit(types.POST_ARTICLE, article)
		return article.message
	},

	/**
	 * Calls API to post user detail data and returns reponse
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async addUser({commit}, payload) {
		const response = (await Api.ApiAdmin().post('/api/addUser', payload)).data
		return response
	},
	/**
	 * GET
	 * Calls api to get all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async fetchTags ({commit}, options = {}) {
		await Api.ApiAdmin().get('/tags', options)
			.then(data => {
				commit(types.SET_TAGS, data.data)
				return data.data
			}, err => {
				console.log(err)
			})
	},
	/**
	 * POST
	 * Calls api to post array of tags 
	 * TODO: Commit mutation to set state tagd array to retrieved result
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async postTags({commit}, payload) {
		let tags = (await Api.ApiAdmin().post('/api/tags', payload)).data
		commit(types.ADD_TAGS, tags)
		return tags
	},
	/**
	 * PUT
	 * Calls api to put array of tags - updating
	 * names of tags in db and commiting to Vuex store
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async updateTags ({commit}, payload) {
		let tags = (await Api.ApiAdmin().put('/api/tags', payload)).data
		commit(types.SET_TAGS, tags.tags)
		return tags
	},
	/**
	 * DELETE
	 * Calls api to delete array of tags 
	 * Vuex mutation called within component 
	 * to delete tags from state
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async deleteTags ({commit}, payload) {
		let params = {
			data: payload
		}
		let deletedTags = (await Api.ApiAdmin().delete('/api/tags', params)).data
		commit(types.REMOVE_TAG, deletedTags)
		return deletedTags.deleteCount
	},
	/**
	 * GET
	 * Calls api to get article if current logged in user is contributor
	 * to the article. Commits mutation to set article object in store
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticleApi ({commit}, id) {
		const article = (await Api.ApiAdmin().get(`/api/articles/${id}`)).data
		commit(types.FETCH_ARTICLE, article)
		return article
	},

	/**
	 * GET
	 * Calls api to get articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async fetchArticlesApi ({commit}, payload) {
		const articles = (await Api.ApiAdmin().get('/api/articles', payload.params)).data		
		commit(types.FETCH_ARTICLES, articles)
		return articles
	},
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
	 * PUT
	 * Calls api to update payload object article in db
	 * and commits mutation
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async updateArticle ({commit}, payload) {
		const article = (await Api.ApiAdmin().put(`/api/articles/${payload.id}`, payload.article)).data
		commit(types.UPDATE_ARTICLE, article)
		return article.message
	},
	/**
	 * DELETE
	 * Calls api to delete article by id passed in and commits
	 * mutation to remove from state array by returned index value
	 * @param {commit} param0 
	 * @param {String} payload 
	 */
	async deleteArticle ({commit}, payload) {
		let deleteCount = (await Api.ApiAdmin().delete(`/api/articles/${payload}`, payload)).data
		commit(types.DELETE_ARTICLE, deleteCount)
		return deleteCount
	}
}