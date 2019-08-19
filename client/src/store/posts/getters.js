export default {
	getArticle: (state) => (id) => {
		return state.articles.find(article => article._id === id)
	},
	siteTitle: (state) => {
		return state.strings.title
	}
}
