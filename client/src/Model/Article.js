class Article {
	constructor (args = {}) {
		this.fill(args)
	}
	/**
	 * Fills class with object attributes
	 * @param {object} param0 
	 */
	fill ({ title = '', draft = '', author = '', body = '', imgCred = '', thumbnailDescription = '', lazyImg = '', img = '', realm = '', tags = [], contributorId = '' }) {
		// this._id = _id
		this.title = title
		this.draft = draft
		this.author = author
		this.body = body
		this.imgCred = imgCred
		this.thumbnailDescription = thumbnailDescription
		this.img = img
		this.lazyImg = lazyImg
		this.realm = realm._id
		this.tags = tags.map(tag => tag._id)
		this.contributorId = contributorId
	}
}
export default Article
