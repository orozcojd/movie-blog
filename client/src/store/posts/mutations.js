import types from '@/store/types'
export default {
	[types.MAX_RELATED_REACHED] (state, payload) {
		state.maxRelatedReached = payload
	},
	/**
	 * Sets article object in store to array of articles
	 * @param {Vuex state} state 
	 * @param {array} payload 
	 */
	[types.FETCH_ARTICLE] (state, payload) {
		state.article = payload
		state.infiniteArticles.push(payload)
	},
	/**
	 * Sets articles array to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_ARTICLES] (state, payload) {
		state.articles = payload
	},
	[types.COPY_RELATED_TAGS] (state, payload) {
		state.associatedArticles.tags.push(payload.realm, ...payload.tags)
	},
	/**
	 * Sets the state tags object to payload object
	 * @param {Vuex state} state 
	 * @param {Array} payload 
	 */
	[types.FETCH_TAGS] (state, payload) {
		if(payload.realm) state.realms = payload.tags
		else state.tags = [...state.realms, payload.tags]
	},
	/**
	 * Sets articles object to payload
	 * TODO Remove state.page in all code.
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_BY_TAG] (state, payload) {
		state.articles = payload.message
		state.pages = payload.pages
		if(payload.pageNo) {
			state.page = payload.pageNo
		}
	},
	[types.FETCH_BY_CONTRIBUTOR] (state, payload) {
		state.articles = payload.message
		state.pages = payload.pages
		if(payload.pageNo) {
			state.page = payload.pageNo
		}
	},
	[types.SET_CONTRIBUTOR] (state, contributor) {
		state.contributor = contributor
	},
	/**
	 * Array Spreads array and pushes into state infiniteArticles array
	 * Increments state pageNo by one and adds Ids to vuex associated
	 * articles array
	 * @param {Vuex state} state 
	 * @param {Array} payload 
	 */
	[types.FETCH_NEXT_ARTICLES] (state, payload) {
		if(payload.message.length) {
			state.infiniteArticles.push(...payload.message)
			state.associatedArticles.pageNo += 1
			state.associatedArticles.articleIds.push(...(payload.message.map(article => article._id)))
		}
	},
	/**
	 * Spreads and pushes payload message to infiniteArticles
	 * state array and increments assoc pageNo by 1
	 * @param {Vuex state} state 
	 * @param {Object} payload 
	 */
	[types.FETCH_UNRELATED_ARTICLES] (state, payload) {
		if(payload.message.length) {
			state.infiniteArticles.push(...payload.message)
			state.unAssociatedArticles.pageNo +=1
		}
		else {
			state.maxArticlesReached = true
		}
	},
	/**
	 * Resets all Vuex inifinite articles arrays
	 * @param {Vuex state} state 
	 */
	[types.RESET_NEXT_ARTICLES] (state) {
		state.infiniteArticles = []
		state.associatedArticles = {
			pageNo: 1,
			articleIds: [],
			tags: []
		}
		state.unAssociatedArticles = {
			pageNo: 1
		}
	},
	/**
	 * Sets state tag to payloadal
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.SET_TAG] (state, payload) {
		state.tag = payload
	},
	[types.SET_TAGS] (state, payload) {
		state.realms = payload.filter(tag => tag.realm === true)
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
