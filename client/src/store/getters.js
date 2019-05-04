export default {
	isUserLoggedin: (state) => {
		let user = state.token.tokenDetails
		if (user) {
			return user.exp > Date.now() / 1000
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
	},
	// getArticlesState: (state) => {
	// 	return state.articles
	// },
	getArticle: (state) => (id) => {
		return state.articles.find(article => article._id === id)
	},
	// getSingleArticle: (state) => {
	// 	return state.article
	// },
	// getTags: (state) => {
	// 	return state.tags
	// }
}
