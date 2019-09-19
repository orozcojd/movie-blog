class Tag {
	constructor (args = {}) {
		this.fill(args)
	}
	/**
	 * Fills class with object attributes
	 * @param {object} param0 
	 */
	fill ({ _id, name = null, lazyImg = null, img = null, realm = null, contributorId = null, prev = null}) {
		this.name = name
		this.lazyImg = lazyImg
		this.img = img
		this.realm = realm
		this.urlTag = name ? name.split(' ').join('-') : null
		this.__type = 'Tag',
		this.contributorId = contributorId
		this.prev = prev ? prev : name.split(' ').join('-') // set prev to prev if exists otherwise name -- new tag
		this._id = _id
	}
}
export default Tag
