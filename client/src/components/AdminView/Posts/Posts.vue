<template>
  <div>
    <vue-headful
      :title="headTitle"
    />
    <v-container
      fluid
      grid-list-md
    >
      <div v-if="!reviewer">
        <h1 v-if="status==='NR'">
          Articles available for review
        </h1>
        <h1 v-else>
          {{ action }} your {{ postType }}
        </h1>
        <div v-if="!articles.length">
          {{ description }}
        </div>
      </div>
      <div v-else>
        <h1>Articles you claimed for review</h1>
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
		description () {
			let description;
			switch(this.status){
			case 'DR':
				description = 'When you create a draft, it will appear here.'
				break;
			case 'AP':
				description = 'When your submitted post gets approved, it will appear here.'
				break;
			case 'NR':
				description = 'When contributors submit posts for review, it will appear here.'
				break;
			default: 
				description = 'When your post is reviewed and rejected, it will appear here.'
			}
			return description
		}
	},
	async mounted () {
		const options = {
			params: {
				status: this.status,
				reviewer: this.reviewer
				// contributorId: this.user.contributorId
			}
		}
		const inReview = this.$route.fullPath.indexOf('review') >= 0
		if(inReview) await this.reviewArticles(options)
		else await this.fetchArticlesApi(options)	
	},
	methods: {
		...mapActions('admin',['fetchArticlesApi', 'reviewArticles'])
	}
}
</script>
