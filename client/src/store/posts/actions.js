import Api from '@/services/Api';
import types from '@/store/types';
import to from '@/store/to';

export default {
	/**
	 * GET
	 * Calls api to get articles and commits mutation to
	 * set state articles array to retrieved articles
	 * @param {commit} param0
	 */
	async fetchArticles({ commit }, payload) {
		const articles = await to(Api.ApiGeneral().get('/articles', payload.params));
		if (articles) commit(types.FETCH_ARTICLES, articles.data);
	},
	setArticleViewed({ commit }, article) {
		commit(types.PUSH_VIEWED, { ...article, id: article._id });
	},
	/**
	 * GET
	 * Calls api to get article by id and commits mutation
	 * to set state article to article retrieved
	 * @param {commit} param0
	 * @param {String} id
	 */
	async fetchArticle({ commit, dispatch }, id) {
		const article = await to(Api.ApiGeneral().get(`/articles/${id}`));
		if (article) {
			dispatch('copyRelatedTags', article.data);
			dispatch('setArticleViewed', article.data);
			commit(types.FETCH_ARTICLE, article.data);
		}
	},
	/**
	 * GET
	 * Calls api to get all related articles by contributor name and commits mutation
	 * to update articles in store.
	 * @param {commit} param0
	 * @param {Object} payload
	 */
	async fetchArticleByContributor({ commit }, payload) {
		const articles = await to(Api.ApiGeneral().get(`/articlesByContributor/${payload.query}`, payload.params));
		if (articles) commit(types.FETCH_BY_CONTRIBUTOR, articles.data);
	},
	async copyRelatedTags({ commit }, payload) {
		commit(types.COPY_RELATED_TAGS, payload);
	},
	/**
	 * GET
	 * Calls API to get associated articles by tag, realms found in current
	 * article and commits payload to store
	 * @param {commit} param0
	 * @param {Object} payload
	 */
	async getNextArticles({ commit, dispatch }, payload) {
		const params = {
			params: payload,
		};
		const nextArticles = await to(Api.ApiGeneral().get('/infinite-articles', params));
		if (nextArticles) {
			if (!payload.latestUnrelated && nextArticles.data.message.length) { commit(types.FETCH_NEXT_ARTICLES, nextArticles.data); } else if (!payload.latestUnrelated && !nextArticles.data.message.length) dispatch('setMaxRelated', true);
			else commit(types.FETCH_UNRELATED_ARTICLES, nextArticles.data);
		}
	},
	/**
	 * GET
	 * Calls api to GET articles with associated tags
	 * from tag param and commits mutation to set state articles array
	 * @param {commit} param0
	 * @param {String} tag
	 */
	async getArticlesByTag({ commit }, payload) {
		const articles = await to(Api.ApiGeneral().get(`/tag/${payload.query}`, payload.params));
		if (articles) commit(types.FETCH_BY_TAG, articles.data);
	},
	/**
	 * GET
	 * Calls api get contributor bio of id passed in. Commits mutation to set
	 * contributor
	 * @param {commit} param0
	 * @param {String} id
	 */
	async getContributorBio({ commit }, id) {
		const contributor = await to(Api.ApiGeneral().get(`/contributors/${id}`));
		if (contributor) commit(types.SET_CONTRIBUTOR, contributor.data);
	},
	/**
	 * Commits mutation to set state tag object to payload tag
	 * @param {commit} param0
	 * @param {Object} payload
	 */
	setTag({ commit }, payload) {
		commit(types.SET_TAG, payload);
	},
	setTags({ commit }, payload) {
		commit(types.SET_TAGS, payload);
	},
	async fetchTag({ commit, dispatch }, payload) {
		const tag = await to(Api.ApiGeneral().get(`/tags/${payload}`));
		if (tag && tag.data.exists) {
			commit(types.SET_TAG, tag.data.tag);
		} else {
			return Promise.reject();
		}
	},
	/**
	 * GET
	 * Calls api to get all tags and commits muation to
	 * set state tags array to retrieved result
	 * @param {commit} param0
	 */
	async getTags({ commit }, options = { params: { realm: false } }) {
		// let tags = (await Api.ApiGeneral().get('tags', options)).data
		const tags = await to(Api.ApiGeneral().get('/tags', options));
		if (tags) commit(types.FETCH_TAGS, { tags: tags.data, realm: options.params.realm });
	},
	/**
	 * Commits mutation to reset infinite scroll objects
	 * @param {commit} param0
	 */
	async resetNextArticles({ commit }) {
		commit(types.RESET_NEXT_ARTICLES);
	},
	/**
	 * Commits mutation to toggle state variable to payload
	 * @param {commit} param0
	 * @param {Boolean} payload
	 */
	setMaxRelated({ commit }, payload) {
		commit(types.MAX_RELATED_REACHED, payload);
	},
};
