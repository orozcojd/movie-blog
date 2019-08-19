export default {
	isUserLoggedin: (state) => {
		const userToken = state.token.tokenDetails
		const userDetail = state.user
		if (!!userToken && !!userDetail) {
			return userToken.exp > Date.now() / 1000
		}
		return false
	},
	// getToken: (state) => {
	// 	return state.token.token
	// },
	getRefeshToken: (state) => {
		return state.token.refreshToken
	},
	getUser: (state) => {
		return state.user
	}
}