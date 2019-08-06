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
			await dispatch('setToken', res.data)
			await dispatch('setUser', res.data.user)
			await dispatch('contributorName')
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
	async passwordReset({commit}, payload) {
		const submission = (await Api.ApiGeneral().post('/auth/forgot-password', payload)).data
		return submission
	},
	/**
	 * POST
	 * Calls api to request for new token given a refresh token
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async refreshToken ({commit}, payload) {
		const token = (await Api.ApiGeneral().post('/tokens', payload)).data
		return token
	},
	/**
	 * 
	 * @param {*} param0 
	 * @param {*} payload 
	 */
	async resetPassword ({commit, dispatch}, payload) {
		const response = (await Api.ApiGeneral({
			headers: { 'Authorization': `Bearer ${payload.token}` }
		}).post('/auth/reset-password', payload.password)).data
		await dispatch('setToken', response)
		await dispatch('setUser', response.user)
		await dispatch('contributorName')
		return response
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
		const token = localStorage.getItem('unsolicited-session-token')
		const refreshToken = localStorage.getItem('unsolicited-session-refresh-token')
		if(refreshToken){
			dispatch('getSetUser')
			dispatch('getSetContributor')
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
	getSetContributor ({commit}) {
		const contributor = JSON.parse(localStorage.getItem('unsolicited-contributor'))
		commit(types.SET_ADMIN_CONTRIBUTOR, contributor)
	},
	/**
	 * POST
	 * Calls api to remove refresh token from backend
	 * @param {commit} param0 
	 * @param {Object} refreshToken 
	 */
	async removeRefreshTkn ({commit}, refreshToken) {
		await (Api.ApiAdmin().post('/tokens/removeRefresh', refreshToken))
	},
	/**
	 * GET
	 * Calls api to get all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async getTags ({commit}, options = {}) {
		// let tags = (await Api.ApiGeneral().get('tags', options)).data
		await Api.ApiGeneral().get('tags', options)
			.then(data => {
				commit(types.FETCH_TAGS, data.data)
				return data.data
			}, err => {
				console.log(err)
			})
		// commit(types.FETCH_TAGS, tags)
		// return tags
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
	 * POST
	 * Calls api to post array of tags 
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
	 * PUT
	 * Calls api to put array of tags - updating
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
	 * GET
	 * Calls api to get article by id and commits mutation 
	 * to set state article to article retrieved
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticle ({commit}, id) {
		const article = (await Api.ApiGeneral().get(`articles/${id}`))
		// console.log(article)
		commit(types.FETCH_ARTICLE, article.data)
		return article
	},
	/**
	 * GET
	 * Calls api to get all related articles by contributor name and commits mutation
	 * to update articles in store.
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async getArticleByContributor({commit}, payload) {
		const articles = (await Api.ApiGeneral().get(`articlesByContributor/${payload.query}`, payload.params)).data
		commit(types.FETCH_BY_CONTRIBUTOR, articles)
		return articles
	},
	/**
	 * GET
	 * Calls api to get article if current logged in user is contributor
	 * to the article. Commits mutation to set article object in store
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticleApi ({commit}, id) {
		const article = (await Api.ApiAdmin().get(`/api/article/${id}`)).data
		commit(types.FETCH_ARTICLE, article)
		return article
	},

	/**
	 * GET
	 * Calls api to get articles and commits mutation to
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
	 * GET
	 * Calls api to get articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async getArticlesApi ({commit}, payload) {
		const articles = (await Api.ApiAdmin().get('/api/articles', payload.params)).data		
		if(payload.params.extend === true) {
			commit(types.EXTEND_ARTICLES, articles)
		}
		else {
			commit(types.FETCH_ARTICLES, articles)
		}
		return articles
	},
	/**
	 * GET
	 * Calls API to get associated articles by tag, realms found in current
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
	 * GET
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
	 * GET
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
	 * GET
	 * Calls api get contributor bio of id passed in. Commits mutation to set
	 * contributor
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async getContributorBio({commit}, id) {
		const contributor = (await Api.ApiGeneral().get(`contributor/${id}`)).data
		commit(types.SET_CONTRIBUTOR, contributor)
		return contributor
	},
	/**
	 * PUT
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
	 * POST
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
	 * DELETE
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
	 * Commits mutation to reset infinite scroll objects
	 * @param {commit} param0 
	 */
	async resetNextArticles({commit}) {
		commit(types.RESET_NEXT_ARTICLES)
	},
	/**
	 * GET
	 * Calls api to get the current logged in user's name and commits mutation
	 * @param {commit} param0 
	 */
	async contributorName({commit}) {
		const name = (await Api.ApiAdmin().get('/api/contribuor-name')).data
		localStorage.setItem('unsolicited-contributor', JSON.stringify(name))
		commit(types.SET_ADMIN_CONTRIBUTOR, name)
	},
	async getContributor({commit}, id) {
		const contributor = (await Api.ApiAdmin().get(`/api/contributor/${id}`)).data
		commit(types.SET_CONTRIBUTOR, contributor)
		return contributor
	},
	/**
	 * PUT
	 * Calls api to update contributor information and commit mutation
	 * to update vuex store 
	 * @param {commit} param0 
	 * @param {Object} id 
	 */
	async updateContributorBio({commit}, payload) {
		const response = (await Api.ApiAdmin().put(`contributor/${payload.id}`, payload)).data
		commit(types.UPDATE_CONTRIBUTOR, response.contributor)
		return response
	},
	/**
	 * Commits mutation to update contributor object attribute
	 * @param {commit} param0 
	 * @param {Object} payload 
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
