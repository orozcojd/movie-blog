import Vue from 'vue';
import { abilitiesPlugin } from '@casl/vue';
import Api from '@/services/Api';
import types from '@/store/types';
import to from '@/store/to';
import defineAbilitiesFor from '@/Authentication/ability';

export default {
	/**
	 * Logs in user if validated by backend and
	 * Commits result to store
	 * @param {commit, dispatch} param0
	 * @param {object} payload
	 */
	async login({ commit, dispatch }, payload) {
		const res = await to(Api.ApiGeneral().post('login', payload));
		if (res) {
			dispatch('setToken', res.data);
			dispatch('setUser', res.data.user);
			dispatch('getContributor', res.data.user.contributorId);
			dispatch('getSetUser', res.data.user);
			return Promise.resolve(res);
		}
		return Promise.reject();
	},
	/**
	 * Commits mutations to set token and user to null
	 * @param {commit, dispatch} param0
	 */
	logOut({ commit, dispatch }) {
		return new Promise((resolve) => {
			const payload = {
				refreshToken: localStorage.getItem('unsolicited-session-refresh-token'),
			};
			dispatch('removeRefreshTkn', payload);
			dispatch('setToken', { token: null, refreshToken: null });
			dispatch('setUser', null);
			resolve();
		});
	},
	/**
	 *
	 * @param {*} param0
	 * @param {*} payload
	 */
	async resetPassword({ commit, dispatch }, payload) {
		const response = await to(Api.ApiGeneral({
			headers: { Authorization: `Bearer ${payload.token}` },
		}).post('/api/auth/reset-password', payload.password));
		if (response) {
			await dispatch('setToken', response.data);
			await dispatch('setUser', response.data.user);
			await dispatch('getContributor', response.data.user.contributorId);
			return Promise.resolve();
		}
	},
	/**
	 *
	 * @param {*} param0
	 * @param {*} payload
	 */
	async passwordReset({ commit }, payload) {
		const submission = await to(Api.ApiGeneral().post('/api/auth/forgot-password', payload));
		if (submission) {
			return submission.data;
		}
	},
	/**
	 * POST
	 * Calls api to request for new token given a refresh token
	 * @param {commit} param0
	 * @param {Object} payload
	 */
	async refreshToken({ commit, dispatch }, payload) {
		const token = await to(Api.ApiGeneral().post('/tokens', payload));
		if (token) {
			dispatch('setTokenAttr', token.data);
		}
	},
	/**
	 * Commits mutation to set state token to param token
	 * @param {commit} param0
	 * @param {Object} token
	 */
	setToken({ commit }, token) {
		commit(types.SET_TOKEN, token);
	},
	setTokenAttr({ commit }, token) {
		commit(types.SET_TOKEN_ATTR, token);
	},
	/**
	 * Commits mutation to set local storage item in store
	 * @param {commit} param0
	 */
	getSetToken({ commit, dispatch }) {
		const token = localStorage.getItem('unsolicited-session-token');
		const refreshToken = localStorage.getItem('unsolicited-session-refresh-token');
		if (refreshToken) {
			dispatch('getSetUser');
			dispatch('getSetContributor');
			commit(types.SET_TOKEN, { token, refreshToken });
		}
	},
	/**
	 * POST
	 * Calls api to remove refresh token from backend
	 * @param {commit} param0
	 * @param {Object} refreshToken
	 */
	async removeRefreshTkn({ commit }, refreshToken) {
		await to(Api.ApiAdmin().post('/tokens/removeRefresh', refreshToken));
	},
	/**
	 * Commits mutations to set user to param user
	 * @param {commit} param0
	 * @param {Object} user
	 */
	setUser({ commit }, user) {
		commit(types.SET_USER, user);
	},
	/**
	 * Gets user name from local storage and sets it to state
	 * @param {commit} param0
	 */
	async getSetUser({ commit, dispatch }, user = null) {
		if (!user) user = JSON.parse(localStorage.getItem('unsolicited-user'));
		dispatch('getSetAclUser');
		commit(types.SET_USER, user);
	},
	async getSetAclUser({ commit }) {
		const aclUser = await to(Api.ApiAdmin().get('/api/user-permission'));
		if (aclUser) {
			Vue.use(abilitiesPlugin, defineAbilitiesFor(aclUser.data.aclUser));
			commit(types.SET_ACL_USER, aclUser.data.aclUser);
		}
	},
	/**
	 * Commits mutation to update contributor object attribute
	 * @param {commit} param0
	 * @param {Object} payload
	 */
	editContributorVal({ commit }, payload) {
		commit(types.EDIT_CONTRIBUTOR_VAL, payload);
	},
	getSetContributor({ commit }) {
		const contributor = JSON.parse(localStorage.getItem('unsolicited-contributor'));
		commit(types.SET_CONTRIBUTOR, contributor);
	},
	/**
	 * Calls API and fetches user permissions, then commits to store
	 * @param {commit} param0
	 */
	async fetchPermissions({ commit }) {
		const permissions = await to(Api.ApiAdmin().get('/api/permissions'));
		if (permissions) {
			commit(types.FETCH_PERMISSIONS, permissions.data);
		}
	},
	async getContributor({ commit }, id) {
		const contributor = await to(Api.ApiAdmin().get(`/api/contributors/${id}`));
		if (contributor) {
			localStorage.setItem('unsolicited-contributor', JSON.stringify(contributor.data));
			commit(types.SET_CONTRIBUTOR, contributor.data);
			return contributor.data;
		}
	},
	/**
	 * PUT
	 * Calls api to update contributor information and commit mutation
	 * to update vuex store
	 * @param {commit} param0
	 * @param {Object} id
	 */
	async updateContributorBio({ commit, dispatch }, payload) {
		const response = await to(Api.ApiAdmin().put(`/api/contributors/${payload.id}`, payload));
		if (response) {
			commit(types.UPDATE_CONTRIBUTOR, response.data.contributor);
			dispatch('admin/setSnackbar', {
				type: 'text',
				value: response.data.message,
				show: true,
			}, { root: true });
		}
	},
};
