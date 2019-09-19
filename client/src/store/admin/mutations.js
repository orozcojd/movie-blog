import types from '@/store/types'
import Vue from 'vue'
export default {
	/**
	 * Sets articles array to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_ARTICLES] (state, payload) {
		state.articles = payload
	},
	/**
	 * Sets article object in store to array of articles
	 * @param {Vuex state} state 
	 * @param {array} payload 
	 */
	[types.FETCH_ARTICLE] (state, payload) {
		console.log(payload)
		state.article = payload
	},
	/**
	 * Sets state article to payload
	 * @param {Vuex state} state 
	 * @param {Object} payload 
	 */
	[types.SET_ARTICLE] (state, payload) {
		state.article = payload
	},
	/**
	 * Maps state article tags & realms to corresponding IDs
	 * TODO: refactor code export copies to tools
	 * @param {Vuex state} state 
	 */
	[types.NEW_ARTICLE] (state) {		
		let found = state.tags.find(tag => tag.urlTag === state.article.realm)
		let realmObj = {}
		console.log(state.article.realm)
		if(!!found && found !== -1) {
			realmObj._id = found._id
			realmObj.name = found.name
			realmObj.img = found.image
			realmObj.urlTag = found.urlTag
		}
		state.article.realm = realmObj
		// copy tags objects
		found = state.tags.filter(function(tag) {
			return this.indexOf(tag.urlTag) >= 0 ;
		},state.article.tags)
		let copiedTags = []
		for(let i = 0; i < found.length; i++) {
			let current = found[i]
			let tmp = {}
			tmp._id = current._id
			tmp.name = current.name
			tmp.img = current.img
			tmp.urlTag = current.urlTag
			copiedTags.push(tmp)
		}
		state.article.tags = copiedTags
		console.log(state.article)
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
	 * Sets state article attribute to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.UPDATE_ARTICLE_CONTENT] (state, payload) {
		Vue.set(state.article, payload.type, payload.value)
	},
	/**
	 * Sets article state payload and pushes article to
	 * ifiniteArticles state
	 * @param {Vuex state} state 
	 * @param {Object} payload 
	 */
	[types.CLEAR_ARTICLE] (state) {
		state.article = {}
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
	 * Pushes each object from payload array into state tags 
	 * array
	 * @param {Vuex state} state 
	 * @param {Array} payload 
	 */
	[types.ADD_TAGS] (state, payload) {
		const tags = payload.tags
		state.tags.push(...tags)

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
	 * @param {number} payload 
	 */
	[types.REMOVE_TAG] (state, payload) {
		state.tags.splice(payload, 1)
	},
	/**
	 * Splices state articles tags attribute array by value of payload
	 * @param {Vuex state} state 
	 * @param {number} payload 
	 */
	[types.REMOVE_POST_TAG] (state, payload) {
		for(let i = 0; i < payload.length; i++) {
			state.article.tags.splice(payload[i], 1)
		}
		
	},
	/**
	 * Find matching _id in state tags array and sets val of tag 
	 * to val in payload 
	 * @param {Vuex state} state 
	 * @param {Object} payload 
	 */
	[types.EDIT_TAG_VAL] (state, payload) {
		// let index = state.tags.findIndex(tag => tag._id === payload.id)
		let tag = state.tags.find(tag => tag._id === payload.id)
		tag[payload.type] = payload.val
		// Vue.set(state.tags, index, tag)
	},
	/**
	 * Sets vuex snackbar Object to payload values passed
	 * @param {Vuex state} state 
	 * @param {Object} payload 
	 */
	[types.SET_SNACKBAR] (state, payload) {
		Vue.set(state.snackbar, payload.type, payload.value)
		if(payload.show) {
			Vue.set(state.snackbar, 'value', true)
		}
	}
}