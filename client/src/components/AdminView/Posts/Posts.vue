<template>
  <div>
    <vue-headful
      :title="headTitle"
    />
    <v-container
      fluid
      grid-list-md
    >
      <h1>
        {{ header }}
      </h1>
 
      <div v-if="!articles.length">
        {{ description }}
      </div>
    </v-container>
    <admin-display-articles
      :articles="articles"
      :reviewer="reviewer"
      :review="review"
    />
  </div>
</template>

<script>
import AdminDisplayArticles from '@/components/AdminView/Posts/AdminDisplayArticles'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
	name: 'AdminView',
	components: {
		AdminDisplayArticles
	},
	props: {
		status: {
			type: String,
			required: true
		},
		review: {
			type: Boolean,
			default: false
		},
		reviewer: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			header: '',
			description: ''
		}
	},
	computed: {
		...mapState('admin',['articles']),
		...mapState('auth', ['user']),
		...mapGetters('posts', ['siteTitle']),
		headTitle () {
			return `Admin View ${this.postType} - ${this.siteTitle}`
		},
		action() {
			return this.status === 'ED' ? 'Review' : 'Edit'
		},
		postType () {
			return this.status === 'DR' ? 'Drafts' : 'Posts'
		},

	},
	async mounted () {
		this.init()
		const options = {
			params: {
				status: this.status,
				reviewer: this.reviewer,
				review: this.review
			}
		}
		
		const inReview = this.$route.fullPath.indexOf('review') >= 0
		console.log(this.status)
		if(inReview) await this.reviewArticles(options)
		else await this.fetchArticlesApi(options)	
	},
	methods: {
		...mapActions('admin',['fetchArticlesApi', 'reviewArticles']),
		init() {
			switch(this.status){
			case 'DR':
				this.header = this.action + ' ' + this.postType
				this.description = 'When you create a draft, it will appear here.'
				break;
			case 'AP':
				this.header = this.action + ' ' + this.postType
				this.description = 'When your submitted post gets approved, it will appear here.'
				break;
			case 'NR':
				if(this.review === true){
					this.header = 'Articles to Review'
					this.description = 'When contributors submit posts for review, it will appear here.'
				}
				else {
					this.header = this.action + ' ' + this.postType
					this.description = 'When your submitted articles are waiting to be claimed for review, it will appear here.'
				}
				break;
			case 'IR':
				if(this.reviewer) {
					this.header = 'Review Articles'
					this.description = 'When you claim an article for review, it will appear here.'
				}
				else {
					this.header = this.action + ' ' + this.postType
					this.description = 'When you submit a post and a reviewer claims it for review, it will appear here.'
				}
				break;
			default: 
				this.header = this.action + ' ' + this.postType
				this.description = 'When your post is reviewed and rejected, it will appear here.'
				break;
			}
		}
	}
	
}
</script>
