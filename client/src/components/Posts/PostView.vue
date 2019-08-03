<template>
  <div
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
  >
    <div
      v-if="loaded"
    >
      <post
        v-for="(article, index) in infiniteArticles"
        :key="index"
        :article="article"
      />
      <div
        v-if="busy"
        class="text-center loading"
        align="center"
      >
        <v-progress-circular
          :size="50"
          indeterminate
          color="purple"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Post from './Post'
export default {
	name: 'PostView',
	components: {
		Post
	},
	data () {
		return {
			busy: false,
			loaded: false
		}
	},
	computed: {
		...mapState([
			'article',
			'tags',
			'associatedArticles',
			'infiniteArticles',
			'unAssociatedArticles',
			'maxRelatedReached',
			'maxArticlesReached'
		]),
		...mapGetters([
			'getArticle',
		]),

		infiniteArticleIds () {
			return this.infiniteArticles.map(article => article._id)
		},
	},
	watch:{
		async maxRelatedReached(val, prev) {
			if(prev === false && val === true) {
				await this.getLatestUnrelated({
					excludeIds: this.infiniteArticleIds,
					...this.unAssociatedArticles,
					id: this.article._id
				})
			}
		}
	},
	async mounted() {
		this.setMaxRelated(false)
		this.resetNextArticles()
		let id = this.$route.params.id
		await this.loadArticle(id)
		this.loaded = true
		this.articleViewed()
		window.scrollTo(0,0);
	},
	methods: {
		...mapActions([
			'fetchArticle',
			'setSingleArticle',
			'getTags',
			'getNextArticles',
			'resetNextArticles',
			'getLatestUnrelated',
			'setMaxRelated'
		]),
		...mapMutations([
			'SET_SINGLE_ARTICLE',
			'PUSH_VIEWED'
		]),
		articleViewed () {
			let viewed = {
				title: this.article.title,
				id: this.article._id,
				img: this.article.img
			}
			this.PUSH_VIEWED(viewed)
		},
		async loadMore() {
			if(!this.loaded || this.maxArticlesReached)
				return
			this.busy = true
			if(!this.maxRelatedReached) {
				await this.getNextArticles({
					article: this.article,
					pageNo: this.associatedArticles.pageNo
				})
			}
			else {
				await this.getLatestUnrelated({
					excludeIds: this.associatedArticles.articleIds,
					...this.unAssociatedArticles,
					id: this.article._id
				})
			}
			this.busy = false
		},
		async loadArticle (id) {
		// if article not found in store, fetch it
			if(id){
				let article = this.getArticle(id)
				if(article) {
					// if article set article state to article found in articles array
					await this.setSingleArticle(article)
				}
				else {
				// else fetch then set article state
					await this.fetchArticle(id)
				}
			}
			else {
				// this.SET_SINGLE_ARTICLE({});
			}
		}
	}
}
</script>

<style scoped>
	.loading {
		margin-top: -4em;
		height: 5em;
	}
</style>
