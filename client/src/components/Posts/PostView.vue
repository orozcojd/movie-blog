<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
  >
    <post
      v-for="(article, index) in infiniteArticles"
      :key="index"
      :article="article"
    />
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
			'unAssociatedArticles'
		]),
		...mapGetters([
			'getArticle'
		]),
		infiniteArticleIds () {
			return this.infiniteArticles.map(article => article._id)
		}
	},
	async mounted() {
		console.log('inside postView')
		this.resetNextArticles()
		let id = this.$route.params.id
		await this.loadArticle(id)
		this.loaded = true
		this.articleViewed()
	},
	methods: {
		...mapActions([
			'fetchArticle',
			'setSingleArticle',
			'getTags',
			'getNextArticles',
			'resetNextArticles',
			'getLatestUnrelated'
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
			this.busy = true
			if(!this.associatedArticles.maxRelatedReached) {
				console.log('not reached yet')
				await this.getNextArticles({
					article: this.article,
					pageNo: this.associatedArticles.pageNo
				})
			}
			else {
				console.log('reached!')
				this.getLatestUnrelated({
					excludeIds: this.infiniteArticleIds,
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
					this.setSingleArticle(article)
				}
				else {
				// else fetch then set article state
					await this.fetchArticle(id)
				}
			}
			else {
				this.SET_SINGLE_ARTICLE({});
			}
		}
	}
}
</script>

<style scoped>

</style>
