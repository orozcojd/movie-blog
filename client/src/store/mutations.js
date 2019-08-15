import types from './types'
import Vue from 'vue'
export default {
	/**
	 * Sets state token to payload token
   * adds/removes token to/from local storage
	 * @param {Vuex state} state 
	 * @param {String} token 
	 */
	[types.SET_TOKEN]: (state, payload) => {
		Vue.set(state.token, 'token', payload.token)
		Vue.set(state.token, 'refreshToken', payload.refreshToken)
		// state.token.token = payload.token
		// state.token.refreshToken = payload.refreshToken
		if (state.token.token) {
			try {
				let payload = state.token.token.split('.')[1]
				payload = window.atob(payload)

				// Use set to keep reactivity
				Vue.set(state.token, 'tokenDetails', JSON.parse(payload))

				localStorage.setItem('unsolicited-session-token', state.token.token)
				localStorage.setItem('unsolicited-session-refresh-token', state.token.refreshToken)
			} catch(err) {
				localStorage.removeItem('unsolicited-session-token')
				localStorage.removeItem('unsolicited-session-refresh-token')
			}
		} else {
			state.token = {}
			localStorage.removeItem('unsolicited-session-token')
			localStorage.removeItem('unsolicited-session-refresh-token')
		}
	},
	[types.SET_ADMIN_CONTRIBUTOR] (state, contributor) {
		state.adminContributor = contributor
	},
	[types.SET_CONTRIBUTOR] (state, contributor) {
		state.contributor = contributor
	},
	[types.EDIT_CONTRIBUTOR_VAL] (state, payload) {
		Vue.set(state.contributor, payload.type, payload.val)
	},
	[types.UPDATE_CONTRIBUTOR] (state, payload) {
		state.contributor = payload
	},
	/**
	 * sets user to string payload
	 * @param {Vuex state} state 
	 * @param {String} user 
	 */
	[types.SET_USER] (state, user) {
		state.user = user
		if(user) {
			localStorage.setItem('unsolicited-user', JSON.stringify(state.user))
		}
		else{ 
			window.localStorage.removeItem('unsolicited-user')
		}
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
	 * Extends state articles array by spreading payload array
	 * and pushing it
	 * @param {Vuex state} state 
	 * @param {Array} payload 
	 */
	[types.EXTEND_ARTICLES] (state, payload) {
		state.articles.push(...payload)
	},
	/**
	 * Sets the state tags object to payload object
	 * @param {Vuex state} state 
	 * @param {Array} payload 
	 */
	[types.FETCH_TAGS] (state, payload) {
		state.tags = payload
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
			articleIds: []
		}
		state.unAssociatedArticles = {
			pageNo: 1,
			
		}
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
		// copy realm object
		
		// if(Object.keys(state.article).length === 0 && state.article.constructor === Object){
		// 	return
		// }
		// else if(state.article.realm._id) {
		// 	return
		// }
		let found = state.tags.find(tag => tag._id === state.article.realm)
		let realmObj = {}
		if(!!found && found !== -1) {
			realmObj._id = found._id
			realmObj.name = found.name
			realmObj.img = found.image
		}
		state.article.realm = realmObj
		// copy tags objects
		found = state.tags.filter(function(tag) {
			return this.indexOf(tag._id) >= 0 ;
		},state.article.tags)
		let copiedTags = []
		for(let i = 0; i < found.length; i++) {
			let current = found[i]
			let tmp = {}
			tmp._id = current._id
			tmp.name = current.name
			tmp.img = current.img
			copiedTags.push(tmp)
		}
		state.article.tags = copiedTags
		console.log(state.article)
	},
	[types.MAX_RELATED_REACHED] (state, payload) {
		state.maxRelatedReached = payload
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
	 * Sets article state payload and pushes article to
	 * ifiniteArticles state
	 * @param {Vuex state} state 
	 * @param {Object} payload 
	 */
	[types.SET_SINGLE_ARTICLE] (state, payload) {
		state.article = payload
		state.infiniteArticles.push(payload)
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
	 * Pushes each object from payload array into state tags 
	 * array
	 * @param {Vuex state} state 
	 * @param {Array} payload 
	 */
	[types.ADD_TAGS] (state, payload) {
		const tags = payload.tags
		for(let i = 0; i < tags.length; i++) {
			state.tags.push(tags[i])
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
