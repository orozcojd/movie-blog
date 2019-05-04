module.exports = () => ({
	token: {
		token: null,
		refreshToken: null,
		tokenDetails: null
	},
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
	snackbar: {
		text: '',
		timeout: 5000,
		value: false
	}
})
