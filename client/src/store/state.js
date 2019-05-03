module.exports = () => ({
	token: {
		token: null,
		refreshToken: null,
		reqPending: false
	},
	userStatus: null,
	userTokenDetails: null,
	user: null,
	articles: [],
	article: {},
	infiniteArticles: [],
	viewedArticles: [],
	tags: [],
	tag: {},
	page: 1,
	pages: null,
	associatedArticles: {
		pageNo: 1,
		articleIds: [],
		// maxRelatedReached: false
	},
	maxRelatedReached: false,
	unAssociatedArticles: {
		pageNo: 1,
		articleIds: [],
	},
	request: {
		success: false,
		error: false,
		errorMsg: ''

	}
})
