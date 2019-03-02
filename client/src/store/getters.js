export default {
  isUserLoggedin: (state) => {
    return state.isUserLoggedIn
  },
  getArticlesState: (state) => {
    return state.articles
  },
  getArticle: (state) => (id) => {
    return state.articles.find(article => article._id === id)
  },
  getSingleArticle: (state) => {
    return state.article
  }
}
