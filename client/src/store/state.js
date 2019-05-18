module.exports = () => ({
	token: {
		token: null,
		refreshToken: null,
		tokenDetails: null
	},
	user: null,
	contributor: {},
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
		timeout: 4000,
		value: false
	},
	strings: {
		title: 'Unsolicited.mp3',
		
	}
})
