import Api from '@/services/Api'
import types from '@/store/types'

export default {
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
		}).post('/api/auth/reset-password', payload.password)).data
		await dispatch('setToken', response)
		await dispatch('setUser', response.user)
		await dispatch('contributorName')
		return response
	},
	/**
	 * GET
	 * Calls api to get articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0 
	 */
	async fetchArticles ({commit}, payload) {
		const articles = (await Api.ApiGeneral().get('/articles', payload.params)).data		
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
	 * Calls api to get article by id and commits mutation 
	 * to set state article to article retrieved
	 * @param {commit} param0 
	 * @param {String} id 
	 */
	async fetchArticle ({commit}, id) {
		const article = (await Api.ApiGeneral().get(`/articles/${id}`))
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
	async fetchArticleByContributor({commit}, payload) {
		const articles = (await Api.ApiGeneral().get(`/articlesByContributor/${payload.query}`, payload.params)).data
		commit(types.FETCH_BY_CONTRIBUTOR, articles)
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
		const nextArticles = (await Api.ApiGeneral().get('/infinite-articles', params)).data
		if(nextArticles.message.length)
			commit(types.FETCH_NEXT_ARTICLES, nextArticles)
		else {
			dispatch('setMaxRelated', true)
		}
		return nextArticles
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
		const nextArticles = (await Api.ApiGeneral().get('/infinite-articles', params)).data
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
		const contributor = (await Api.ApiGeneral().get(`/contributors/${id}`)).data
		commit(types.SET_CONTRIBUTOR, contributor)
		return contributor
	},
	/**
	 * GET
	 * Calls api to get all tags and commits muation to 
	 * set state tags array to retrieved result
	 * @param {commit} param0 
	 */
	async getTags ({commit}, options = {}) {
		// let tags = (await Api.ApiGeneral().get('tags', options)).data
		await Api.ApiGeneral().get('/tags', options)
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
	 * Commits mutation to reset infinite scroll objects
	 * @param {commit} param0 
	 */
	async resetNextArticles({commit}) {
		commit(types.RESET_NEXT_ARTICLES)
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
	 * Commits mutation to toggle state variable to payload
	 * @param {commit} param0 
	 * @param {Boolean} payload 
	 */
	setMaxRelated({commit}, payload) {
		commit(types.MAX_RELATED_REACHED, payload)
	}
}
