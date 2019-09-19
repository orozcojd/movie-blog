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
		const article = await to(Api.ApiAdmin().post('/api/articles/', payload))
		if(article) {
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
		const article = await to(Api.ApiAdmin().put(`/api/articles/${payload.id}`, payload.article))
		if(article) {
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
		const response = await to(Api.ApiAdmin().post('/api/users', payload))
		if(response) {
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
		const data = await to(Api.ApiAdmin().get('/tags', options))
		if(data) {
			dispatch('posts/setTags', data.data, {root: true})
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
		const tags = await to(Api.ApiAdmin().post('/api/tags', payload))
		if(tags) {
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
		let tags = await to(Api.ApiAdmin().put('/api/tags', payload))
		if(tags) {
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
		const res = await to(Api.ApiAdmin().delete('/api/tags', payload))
		if(res) {
			if(res.data.deleted.exists) {
				commit(types.REMOVE_TAG, res.data.deleted.tags)
				dispatch('setSnackbar', {
					type: 'text',
					value: `Deleted the ${res.data.deleted.count.deleteCount} tag(s) selected.`,
					show: true
				})
			}
			if(res.data.rejected.error) {
				dispatch('errors/handleConnectionError', res.data.rejected.message, {root: true})
			}
		}
	},
	/**
	 * GET
	 * Calls api to get article if current logged in user is contributor
	 * to the article. Commits mutation to set article object in store
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticleApi ({commit}, id) {
		const article = await to(Api.ApiAdmin().get(`/api/articles/${id}`))
		if(article) {
			console.log(article.data)
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
	async fetchArticlesApi ({commit}, payload) {
		const articles = await to(Api.ApiAdmin().get('/api/articles', payload.params))
		if(articles) {
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
	async deleteArticle ({commit}, payload) {
		const deleteCount = await to(Api.ApiAdmin().delete(`/api/articles/${payload}`, payload))
		if(deleteCount) {
			commit(types.DELETE_ARTICLE, deleteCount.data)
			return deleteCount.data
		}
	}
}