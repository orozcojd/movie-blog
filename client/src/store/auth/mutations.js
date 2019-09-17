import types from '@/store/types'
import Vue from 'vue'
export default {
	/**
	 * sets permissions array to payload
	 * @param {Vuex state} state 
	 * @param {object} payload 
	 */
	[types.FETCH_PERMISSIONS] (state, payload) {
		state.permissions = payload
	},
	/**
	 * Sets state token to payload token
   * adds/removes token to/from local storage
	 * @param {Vuex state} state 
	 * @param {String} token 
	 */
	[types.SET_TOKEN]: (state, payload) => {
		Vue.set(state.token, 'token', payload.token)
		Vue.set(state.token, 'refreshToken', payload.refreshToken)
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
	[types.SET_TOKEN_ATTR] (state, payload) {
		Vue.set(state.token, 'token', payload.token)
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
	[types.SET_ACL_USER] (state, payload) {
		state.aclUser = payload
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
}