module.exports = () => ({
	token: null,
	userStatus: null,
	userTokenDetails: null,
	user: null,
	articles: [],
	article: {},
	infiniteArticles: [],
	new: [],
	viewedArticles: [],
	tags: [],
	tag: {},
	page: 1,
	pages: null,
	associatedArticles: {
		pageNo: 1,
		articleIds: [],
		maxRelatedReached: false
	},
	unAssociatedArticles: {
		pageNo: 1,
		articleIds: [],
	}
})
