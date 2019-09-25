<template>
  <div
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
  >
    <div v-if="!loaded">
      <card-view>
        <loading-post />
      </card-view>
    </div>
    <div>
      <post
        v-for="(article, index) in infiniteArticles"
        :key="index"
        :article="article"
        @setloaded="loaded = true; busy = false"
      />
    </div>
    <div
      v-if="loaded && busy && !maxArticlesReached"
      class="text-center"
      align="center"
    >
      <card-view>
        <loading-post />
      </card-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import store from '@/store'
export default {
	name: 'PostView',
	components: {
		Post: () => import('./Post'),
		CardView: () => import('@/components/Layouts/CardView'),
		LoadingPost: () => import('@/components/Loading/post')
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
			// 'tags',
			'associatedArticles',
			'infiniteArticles',
			'unAssociatedArticles',
			'maxRelatedReached',
			'maxArticlesReached'
		]),
		infiniteArticleIds () {
			return this.infiniteArticles.map(article => article._id)
		}
	},
	watch:{
		async maxRelatedReached(val, prev) {
			if(prev === false && val === true) {
				await this.getNextArticles({
					relatedTags: this.associatedArticles.tags,
					pageNo: this.unAssociatedArticles.pageNo,
					id: this.article._id,
					latestUnrelated: true
				})
			}
		}
	},
	beforeRouteUpdate(to, from, next) {
		this.loaded = false
		store.dispatch('posts/resetNextArticles')
		store.dispatch('posts/fetchArticle', (to.params.id))
		next()
	},
	beforeRouteEnter (to, from, next) {
		store.dispatch('posts/fetchArticle', (to.params.id))
		store.dispatch('posts/resetNextArticles')
		next()
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			window.scrollTo(0,0);			
		},
		...mapActions('posts', [
			'fetchArticle',
			'getNextArticles',
			'resetNextArticles',
			'setArticle',
		]),
		...mapMutations('posts',['PUSH_VIEWED']),
		async loadMore() {
			if(!this.loaded || this.maxArticlesReached || this.busy){
				console.log('cant load more')
				return
			}
			console.log(`${this.loaded} ${this.maxArticlesReached} ${this.busy}`)
			console.log('about to load more!')
			this.busy = true
			if(!this.maxRelatedReached) {
				await this.getNextArticles({
					id: this.article._id,
					pageNo: this.associatedArticles.pageNo,
					relatedTags: this.associatedArticles.tags,
				})
			}
			else {
				await this.getNextArticles({
					relatedTags: this.associatedArticles.tags,
					pageNo: this.unAssociatedArticles.pageNo,
					id: this.article._id,
					latestUnrelated: true
				})
			}
		}
	}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans&display=swap');
</style>
