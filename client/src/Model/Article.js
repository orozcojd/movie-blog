class Article {
  constructor (args = {}) {
    this.fill(args)
  }
  fill ({ _id = null, title = null, author = null, body = null, thumbnailDescription = null, img = null, category = null }) {
    this._id = _id
    this.title = title
    this.author = author
    this.body = body
    this.thumbnailDescription = thumbnailDescription
    this.img = img
    this.category = category
  }
}
export default Article
