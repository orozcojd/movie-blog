class Article {
	constructor (args = {}) {
		this.fill(args)
	}
	/**
	 * Fills class with object attributes
	 * @param {object} param0 
	 */
	fill ({ title = null, draft = null, author = null, body = null, thumbnailDescription = null, img = null, realm = null }) {
		// this._id = _id
		this.title = title
		this.draft = draft
		this.author = author
		this.body = body
		this.thumbnailDescription = thumbnailDescription
		this.img = img
		this.realm = realm
	}
}
export default Article
