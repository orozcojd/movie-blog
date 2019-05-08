class Contributor {
	constructor (args = {}) {
		this.fill(args)
	}
	/**
	 * Fills class with object attributes
	 * @param {object} param0 
	 */
	fill ({ name = null, bio = null, img = null, twitter = null, instagram = null}) {
		this.name = name
		this.bio = bio
		this.img = img
		this.twitter = twitter
		this.instagram = instagram
	}
}
export default Contributor
