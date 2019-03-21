import types from './types'
import Vue from 'vue'
export default {
	
	[types.AUTH_REQUEST]: (state) => {
		/*
      sets user status state to to loading
    */
		state.userStatus = 'loading'
	},
	[types.AUTH_SUCCESS]: (state) => {
		/*
      sets user status state to to success
    */
		state.userStatus = 'success'
	},
	[types.AUTH_ERR]: (state) => {
		/*
      sets user status state to to error
    */
		state.userStatus = 'error'
	},
	[types.SET_TOKEN]: (state, token) => {
		/*
      sets state token to payload token
      adds/removes token to/from local storage
    */
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
	[types.SET_USER] (state, user) {
		/*
      sets user to payload user
    */
		state.user = user
	},
	[types.FETCH_ARTICLES] (state, payload) {
		/*
      sets articles array to payload
    */
		state.articles = payload
	},
	[types.FETCH_TAGS] (state, payload) {
		state.tags = payload
	},
	[types.FETCH_BY_TAG] (state, payload) {
		state.articles = payload
	},
	[types.FETCH_ARTICLE] (state, payload) {
		/*
      sets article object in store to payload
    */
		state.article = payload
	},
	[types.UPDATE_ARTICLE] (state, payload) {
		/*
      finds the index of matching _id in articles array and updates value
      at that index with payload
    */
		let index = state.articles.findIndex(article => article._id === payload.article._id)
		if (index !== -1) {
			Vue.set(state.articles, index, payload.article)
		} else {
			state.articles.push(payload)
		}
	},
	[types.SET_SINGLE_ARTICLE] (state, payload) {
		/*
			sets article state to payload
		*/
		state.article = payload
	},
	[types.UPDATE_ARTICLE_CONTENT] (state, payload) {
		/* 
			sets state article attribute to payload
		*/
		Vue.set(state.article, payload.type, payload.value)
	},
	[types.POST_ARTICLE] (state, payload) {
		/*
      unshifts new article to start of state articles array
    */
		state.articles.unshift(payload.article)
	},
	[types.DELETE_ARTICLE] (state, payload) {
		/*
      if response count, then removes index from state array otherwise returns
    */
		let count = payload.deleteCount.n
		if (!count) {
			return
		}
		let index = state.articles.findIndex(article => article._id === payload.id)
		Vue.delete(state.articles, index)
	},
	[types.ADD_TAGS] (state, payload) {
		console.log(payload)
		state.tags.push(payload)
	},
	[types.SET_TAGS] (state, payload) {
		state.tags = payload
	},
	[types.REMOVE_TAG] (state, payload) {
		state.tags.splice(payload, 1)
	},
	[types.REMOVE_POST_TAG] (state, payload) {
		state.article.tags.splice(payload, 1)
	},
	[types.PUSH_VIEWED] (state, payload) {
		let index = state.viewedArticles.findIndex(article => article.id === payload.id)
		if (index == -1) {
			state.viewedArticles.push(payload)
		}
	}
}
