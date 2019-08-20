import Api from '@/services/Api'
import types from '@/store/types'

export default {
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

	/**
	 * 
	 * @param {*} param0 
	 * @param {*} payload 
	 */
	async passwordReset({commit}, payload) {
		const submission = (await Api.ApiGeneral().post('/api/auth/forgot-password', payload)).data
		return submission
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
	 * POST
	 * Calls api to remove refresh token from backend
	 * @param {commit} param0 
	 * @param {Object} refreshToken 
	 */
	async removeRefreshTkn ({commit}, refreshToken) {
		await (Api.ApiAdmin().post('/tokens/removeRefresh', refreshToken))
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
	async contributorName({commit}) {
		const name = (await Api.ApiAdmin().get('/api/contribuor-name')).data
		localStorage.setItem('unsolicited-contributor', JSON.stringify(name))
		commit(types.SET_ADMIN_CONTRIBUTOR, name)
	},
	async getContributor({commit}, id) {
		const contributor = (await Api.ApiAdmin().get(`/api/contributors/${id}`)).data
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
		const response = (await Api.ApiAdmin().put(`/api/contributors/${payload.id}`, payload)).data
		console.log(response)
		commit(types.UPDATE_CONTRIBUTOR, response.contributor)
		return response
	}
}