import types from './types'
import Vue from 'vue'
export default {
	/**
	 * Sets user status state to to loading
	 * @param {Vuex state} state 
	 */
	[types.AUTH_REQUEST]: (state) => {
		state.userStatus = 'loading'
	},
	/**
	 * Sets user status state to to success
	 * @param {Vuex state} state 
	 */
	[types.AUTH_SUCCESS]: (state) => {
		state.userStatus = 'success'
	},
	/**
	 * Sets user status state to to error
	 * @param {Vuex state} state 
	 */
	[types.AUTH_ERR]: (state) => {
		state.userStatus = 'error'
	},
	/**
	 * Sets state token to payload token
   * adds/removes token to/from local storage
	 * @param {Vuex state} state 
	 * @param {String} token 
	 */
	[types.SET_TOKEN]: (state, token) => {
		state.token = token
		if (token) {
			let payload = token.split('.')[1]
			payload = window.atob(payload)
			state.userTokenDetails = JSON.parse(payload)
			localStorage.setItem('session-token', token)
		} else {
			state.userTokenDetails = null
			window.localStorage.removeItem('session-token')
		}
	},
	/**
	 * sets user to string payload
	 * @param {Vuex state} state 
	 * @param {String} user 
	 */
	[types.SET_USER] (state, user) {
		state.user = user
	},
	/**
	 * Sets articles array to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_ARTICLES] (state, payload) {
		state.articles = payload
	},
	/**
	 * Sets the state tags object to payload object
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_TAGS] (state, payload) {
		state.tags = payload
	},
	/**
	 * Sets articles object to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_BY_TAG] (state, payload) {
		state.articles = payload
	},
	/**
	 * Sets article object in store to array of articles
	 * @param {Vuex state} state 
	 * @param {array} payload 
	 */
	[types.FETCH_ARTICLE] (state, payload) {
		state.article = payload
	},
	/**
	 * Finds the index of matching _id in articles array and updates value
   * at that index with payload
	 * @param {Vuex state} state 
	 * @param {Article object} payload 
	 */
	[types.UPDATE_ARTICLE] (state, payload) {
		let index = state.articles.findIndex(article => article._id === payload.article._id)
		if (index !== -1) {
			Vue.set(state.articles, index, payload.article)
		} else {
			state.articles.push(payload)
		}
	},
	/**
	 * Sets article state to array of articles
	 * @param {Vuex state} state 
	 * @param {array} payload 
	 */
	[types.SET_SINGLE_ARTICLE] (state, payload) {
		state.article = payload
	},
	/**
	 * Sets state article attribute to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.UPDATE_ARTICLE_CONTENT] (state, payload) {
		Vue.set(state.article, payload.type, payload.value)
	},
	/**
	 * Adds new article to front of state articles array
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.POST_ARTICLE] (state, payload) {
		state.articles.unshift(payload.article)
	},
	/**
	 * If response count, then removes index from state array otherwise returns
	 * @param {Vuex state} state 
	 * @param {objcect} payload 
	 */
	[types.DELETE_ARTICLE] (state, payload) {
		let count = payload.deleteCount.n
		if (!count) {
			return
		}
		let index = state.articles.findIndex(article => article._id === payload.id)
		Vue.delete(state.articles, index)
	},
	/**
	 * Adds tag object to state array of tags
	 * @param {Vuex state} state 
	 * @param {object*} payload 
	 */
	[types.ADD_TAGS] (state, payload) {
		state.tags.push(payload)
	},
	/**
	 * Sets state tag to payloadal
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.SET_TAG] (state, payload) {
		state.tag = payload
	},
	/**
	 * Sets state tags array to payload
	 * @param {Vuex state} state 
	 * @param {array} payload 
	 */
	[types.SET_TAGS] (state, payload) {
		state.tags = payload
	},
	/**
	 * Splices state tags array by value of payload
	 * @param {Vuex state} state 
	 * @param {int} payload 
	 */
	[types.REMOVE_TAG] (state, payload) {
		state.tags.splice(payload, 1)
	},
	/**
	 * Splices state articles tags attribute array by value of payload
	 * @param {Vuex state} state 
	 * @param {int} payload 
	 */
	[types.REMOVE_POST_TAG] (state, payload) {
		state.article.tags.splice(payload, 1)
	},
	/**
	 * Pushes payload object to state viewedArticles array
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.PUSH_VIEWED] (state, payload) {
		let index = state.viewedArticles.findIndex(article => article.id === payload.id)
		if (index == -1) {
			state.viewedArticles.push(payload)
		}
	}
}
