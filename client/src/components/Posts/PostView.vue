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
import { mapState, mapMutations, mapActions } from 'vuex'
import store from '@/store'
export default {
	name: 'PostView',
	components: {
		Post: () => import('./Post')
	},
	data () {
		return {
			busy: false,
			loaded: false
		}
	},
	computed: {
		...mapState('posts', [
			'article',
			'tags',
			'associatedArticles',
			'infiniteArticles',
			'unAssociatedArticles',
			'maxRelatedReached',
			'maxArticlesReached'
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
	beforeRouteEnter (to, from, next) {
		let id = to.params.id
		store.dispatch('posts/fetchArticle', (id))
		next()
	},
	async mounted() {
		this.setMaxRelated(false)
		this.resetNextArticles()
		this.loaded = true
		this.articleViewed()
		window.scrollTo(0,0);
	},
	methods: {
		...mapActions('posts', [
			'fetchArticle',
			'getNextArticles',
			'resetNextArticles',
			'getLatestUnrelated',
			'setMaxRelated',
			'setArticle'
		]),
		...mapMutations('posts',['PUSH_VIEWED']),
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
				console.log('HERE')
				await this.getLatestUnrelated({
					excludeIds: this.associatedArticles.articleIds,
					...this.unAssociatedArticles,
					id: this.article._id
				})
			}
			this.busy = false
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
