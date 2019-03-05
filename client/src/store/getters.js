export default {
	isUserLoggedin: (state) => {
		let user = state.userTokenDetails
		if (user) {
			return user.exp > Date.now() / 1000
		}
		return false
	},
	getArticlesState: (state) => {
		return state.articles
	},
	getArticle: (state) => (id) => {
		return state.articles.find(article => article._id === id)
	},
	getSingleArticle: (state) => {
		return state.article
	},
	getToken: (state) => {
		return state.token
	}
}
