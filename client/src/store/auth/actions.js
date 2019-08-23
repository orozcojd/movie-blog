import Api from '@/services/Api'
import types from '@/store/types'
import to from '@/store/to'
export default {
	/**
	 * Logs in user if validated by backend and
	 * Commits result to store
	 * @param {commit, dispatch} param0 
	 * @param {object} payload 
	 */
	async login({commit, dispatch}, payload) {
		const [err, res] = await to(Api.ApiGeneral().post('login', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			await dispatch('setToken', res.data)
			await dispatch('setUser', res.data.user)
			await dispatch('contributorName')
			return res
		}

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
			dispatch('setToken', {token: null, refreshToken: null})
			dispatch('setUser', null)
			resolve()
		})
	},
	/**
	 * 
	 * @param {*} param0 
	 * @param {*} payload 
	 */
	async resetPassword ({commit, dispatch}, payload) {
		const [err, response] = await to(Api.ApiGeneral({
			headers: { 'Authorization': `Bearer ${payload.token}` }
		}).post('/api/auth/reset-password', payload.password))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			await dispatch('setToken', response.data)
			await dispatch('setUser', response.data.user)
			await dispatch('contributorName')
			return Promise.resolve()
		}
	},
	/**
	 * 
	 * @param {*} param0 
	 * @param {*} payload 
	 */
	async passwordReset({commit, dispatch}, payload) {
		const [err, submission] = await to(Api.ApiGeneral().post('/api/auth/forgot-password', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			return submission.data
		}
	},
	/**
	 * POST
	 * Calls api to request for new token given a refresh token
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	async refreshToken ({commit, dispatch}, payload) {
		const [err, token] = await to(Api.ApiGeneral().post('/tokens', payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
		}
		else {
			dispatch('setTokenAttr', token.data)
		}
	},
	/**
	 * Commits mutation to set state token to param token
	 * @param {commit} param0 
	 * @param {Object} token 
	 */
	setToken ({commit}, token) {
		commit(types.SET_TOKEN, token)
	},
	setTokenAttr ({commit}, token) {
		commit(types.SET_TOKEN_ATTR, token)
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
	 * POST
	 * Calls api to remove refresh token from backend
	 * @param {commit} param0 
	 * @param {Object} refreshToken 
	 */
	async removeRefreshTkn ({commit, dispatch}, refreshToken) {
		const [err] = await to(Api.ApiAdmin().post('/tokens/removeRefresh', refreshToken))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
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
	/**
	 * Commits mutation to update contributor object attribute
	 * @param {commit} param0 
	 * @param {Object} payload 
	 */
	editContributorVal({commit}, payload) {
		commit(types.EDIT_CONTRIBUTOR_VAL, payload)
	},
	getSetContributor ({commit}) {
		const contributor = JSON.parse(localStorage.getItem('unsolicited-contributor'))
		commit(types.SET_ADMIN_CONTRIBUTOR, contributor)
	},
	/**
	 * GET
	 * Calls api to get the current logged in user's name and commits mutation
	 * @param {commit} param0 
	 */
	async contributorName({commit, dispatch}) {
		const [err, name] = await to(Api.ApiAdmin().get('/api/contribuor-name'))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
		}
		else {
			localStorage.setItem('unsolicited-contributor', JSON.stringify(name.data))
			commit(types.SET_ADMIN_CONTRIBUTOR, name.data)
		}
	},
	async getContributor({commit, dispatch}, id) {
		const [err, contributor] = await to(Api.ApiAdmin().get(`/api/contributors/${id}`))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
		}
		commit(types.SET_CONTRIBUTOR, contributor.data)
		return contributor.data
	},
	/**
	 * PUT
	 * Calls api to update contributor information and commit mutation
	 * to update vuex store 
	 * @param {commit} param0 
	 * @param {Object} id 
	 */
	async updateContributorBio({commit, dispatch}, payload) {
		const [err, response] = await to(Api.ApiAdmin().put(`/api/contributors/${payload.id}`, payload))
		if(err) {
			dispatch('errors/handleConnectionError', err.response, {root: true})
			return Promise.reject()
		}
		else {
			commit(types.UPDATE_CONTRIBUTOR, response.data.contributor)
			dispatch('admin/setSnackbar', {
				type: 'text',
				value: response.data.message,
				show: true
			}, {root: true})
		}
	}
}