module.exports = () => ({
	token: null,
	userStatus: null,
	userTokenDetails: null,
	user: null,
	articles: [],
	article: {},
	new: [],
	viewedArticles: [],
	tags: [],
	tag: {},
	page: 1,
	pages: null,
	associatedArticles: {
		pageNo: 1,
		currIndex: 0,
		nextArticle: null,
		articleIds: []
	}
})
