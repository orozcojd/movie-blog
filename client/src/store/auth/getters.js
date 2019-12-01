export default {
	isUserLoggedin: (state) => {
		const userToken = state.token.tokenDetails;
		const userDetail = state.user;
		if (!!userToken && !!userDetail) {
			return userToken.exp > Date.now() / 1000;
		}
		return false;
	},
	// getToken: (state) => {
	// 	return state.token.token
	// },
	getRefeshToken: (state) => state.token.refreshToken,
	getUser: (state) => state.user,
	getAclUser: (state) => state.aclUser,
};
