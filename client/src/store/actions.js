import Api from '@/services/Api'
import types from './types'

export default {


	/**
	 * Calls API to post user detail data and returns reponse
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async addUser({commit}, payload) {
		const response = (await Api.ApiAdmin().post('addUser', payload)).data
		return response
	},

	/**
	 * Logs in user if validated by backend and
	 * Commits result to store
	 * @param {commit, dispatch} param0 
	 * @param {object} payload 
	 */
	async login({commit, dispatch}, payload) {
		await Api.ApiGeneral().post('login', payload).then(async (res) => {
			console.log(res)
			await dispatch('setToken', res.data)
			await dispatch('setUser', res.data.user)
			return res
		}).catch(err => {
			return Promise.reject(err)
		})
	},
	/**
	 * Commits mutations to set token and user to null
	 * @param {commit, dispatch} param0 
	 */
	logOut({commit, dispatch}) {
		return new Promise((resolve) => {
			const payload = {
				refreshToken: localStorage.getItem('unsolicited-session-refresh-token')
			}
			dispatch('removeRefreshTkn', payload)
			dispatch('setToken', {
				token: null,
				refreshToken: null
			})
			dispatch('setUser', null)
			resolve()
		})
	},
	async refreshToken ({commit}, payload) {
		const token = (await Api.ApiGeneral().post('/tokens', payload)).data
		return token
	},
	/**
	 * Commits mutation to set state token to param token
	 * @param {commit} param0 
	 * @param {Object} token 
	 */
	setToken ({commit}, token) {
		commit(types.SET_TOKEN, token)
	},
	/**
	 * Commits mutation to set local storage item in store
	 * @param {commit} param0 
	 */
	getSetToken ({commit, dispatch}) {
		console.log('getting setting token')
		const token = localStorage.getItem('unsolicited-session-token')
		const refreshToken = localStorage.getItem('unsolicited-session-refresh-token')
		if(refreshToken){
			dispatch('getSetUser')
			commit(types.SET_TOKEN, {token: token, refreshToken: refreshToken})
		}
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
	async removeRefreshTkn ({commit}, refreshToken) {
		await (Api.ApiAdmin().post('/tokens/removeRefresh', refreshToken))
	},
	/**
	 * Calls api to GET all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async getTags ({commit}, options = {}) {
		let tags = (await Api.ApiGeneral().get('tags', options)).data
		commit(types.FETCH_TAGS, tags)
		return tags
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
		let tags = (await Api.ApiAdmin().post('tags', payload)).data
		commit(types.ADD_TAGS, tags)
		return tags
	},
	/**
	 * Calls api to PUT array of tags - updating
	 * names of tags in db and commiting to Vuex store
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async updateTags ({commit}, payload) {
		let tags = (await Api.ApiAdmin().put('tags', payload)).data
		commit(types.FETCH_TAGS, tags.tags)
		return tags
	},
	/**
	 * Calls api to DELETE array of tags 
	 * Vuex mutation called within component 
	 * to delete tags from state
	 * @param {commit} param0 
	 * @param {Array} payload 
	 */
	async deleteTags ({commit}, payload) {
		let params = {
			data: payload
		}
		let deletedTags = (await Api.ApiAdmin().delete('tags', params)).data
		commit(types.REMOVE_TAG, deletedTags)
		return deletedTags.deleteCount

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
		const article = (await Api.ApiGeneral().get(`articles/${id}`)).data
		commit(types.FETCH_ARTICLE, article)
		return article
	},
	async getArticleByContributor({commit}, payload) {
		// console.log(payload.page)
		const articles = (await Api.ApiGeneral().get(`articlesByContributor/${payload.query}`, payload.params)).data
		commit(types.FETCH_BY_CONTRIBUTOR, articles)
		return articles
	},
	/**
	 * Calls api to GET articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async getArticles ({commit}, payload) {
		const articles = (await Api.ApiAdmin().get('/articles', payload.params)).data		
		if(payload.params.extend === true) {
			commit(types.EXTEND_ARTICLES, articles)
		}
		else {
			commit(types.FETCH_ARTICLES, articles)
		}
		return articles
	},
	/**
	 * Calls api to GET articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async getArticlesApi ({commit}, payload) {
		const articles = (await Api.ApiAdmin().get('/api/articles', payload.params)).data		
		if(payload.params.extend === true) {
			commit(types.EXTEND_ARTICLES, articles)
			console.log('extending')
		}
		else {
			console.log('hre')
			commit(types.FETCH_ARTICLES, articles)
		}
		return articles
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
		const nextArticles = (await Api.ApiGeneral().get('infinite-articles', params)).data
		if(nextArticles.message.length)
			commit(types.FETCH_NEXT_ARTICLES, nextArticles)
		else {
			dispatch('setMaxRelated', true)
		}
		return nextArticles
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
		const nextArticles = (await Api.ApiGeneral().get('infinite-articles', params)).data
		commit(types.FETCH_UNRELATED_ARTICLES, nextArticles)
		return nextArticles
	},
	/**
	 * Calls api to GET articles with associated tags 
	 * from tag param and commits mutation to set state articles array
	 * @param {commit} param0 
	 * @param {String} tag 
	 */
	async getArticlesByTag ({commit}, payload) {
		const articles = (await Api.ApiGeneral().get(`/tag/${payload.query}`, payload.params)).data
		commit(types.FETCH_BY_TAG, articles)
		return articles
	},
	/**
	 * Calls api to update payload object article in db
	 * and commits mutation
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async updateArticle ({commit}, payload) {
		const article = (await Api.ApiAdmin().put(`articles/${payload.id}`, payload.article)).data
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
		const article = (await Api.ApiAdmin().post('article/', payload)).data
		commit(types.POST_ARTICLE, article)
		return article.message
	},
	/**
	 * Calls api to delete article by id passed in and commits
	 * mutation to remove from state array by returned index value
	 * @param {commit} param0 
	 * @param {String} payload 
	 */
	async deleteArticle ({commit}, payload) {
		let deleteCount = (await Api.ApiAdmin().delete(`article/${payload}`, payload)).data
		commit(types.DELETE_ARTICLE, deleteCount)
		return deleteCount
	},
	/**
	 * 
	 * @param {*} param0 
	 */
	async resetNextArticles({commit}) {
		commit(types.RESET_NEXT_ARTICLES)
	},
	/**
	 * 
	 * @param {*} param0 
	 * @param {*} id 
	 */
	async getContributorBio({commit}, id) {
		const contributor = (await Api.ApiAdmin().get(`contributor/${id}`)).data
		commit(types.SET_CONTRIBUTOR, contributor)
		return contributor
	},
	/**
	 * 
	 * @param {*} param0 
	 * @param {*} id 
	 */
	async updateContributorBio({commit}, payload) {
		const response = (await Api.ApiAdmin().post(`contributor/${payload.id}`, payload)).data
		commit(types.UPDATE_CONTRIBUTOR, response.contributor)
		return response
	},
	/**
	 * 
	 * @param {*} param0 
	 * @param {*} payload 
	 */
	editContributorVal({commit}, payload) {
		commit(types.EDIT_CONTRIBUTOR_VAL, payload)
	},
	/**
	 * Commits mutation to set vuex snackbar to value in payload
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	setSnackbar({commit}, payload) {
		commit(types.SET_SNACKBAR, payload)
	}
}
