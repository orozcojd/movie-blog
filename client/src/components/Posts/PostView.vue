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
    <div v-show="loaded">
      <post
        v-for="(article, index) in infiniteArticles"
        :key="index"
        :article="article"
        @setloaded="loaded = true; busy = false"
      />
      <div
        v-if="busy && !maxArticlesReached"
        class="text-center"
        align="center"
      >
        <card-view>
          <loading-post />
        </card-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import store from '@/store'
// import LoadingPost from '@/components/Loading/post'
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
			'tags',
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
				console.log(val)
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
		this.loaded=false
		let id = to.params.id
		store.dispatch('posts/fetchArticle', (id))
		next()
	},
	beforeRouteEnter (to, from, next) {
		let id = to.params.id
		store.dispatch('posts/fetchArticle', (id))
		next()
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			this.setMaxRelated(false)
			this.resetNextArticles()
			this.articleViewed()
			window.scrollTo(0,0);			
		},
		...mapActions('posts', [
			'fetchArticle',
			'getNextArticles',
			'resetNextArticles',
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
			if(!this.loaded || this.maxArticlesReached || this.busy){
				return
			}
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
			// this.busy = false
		}
	}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins&display=swap');
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans&display=swap');
	/* .loading {
		margin-top: -4em;
		height: 5em;
	} */
</style>
