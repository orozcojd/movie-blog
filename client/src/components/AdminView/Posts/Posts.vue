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
        Edit your {{ postType }}
      </h1>
      <div v-if="!filterArticles.length">
        When you {{ description }}, it will appear here.
      </div>
    </v-container>
    <admin-display-articles 
      :articles="filterArticles"
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
		drafts: {
			type: Boolean,
			default: false,
			required: false
		}
	},
	computed: {
		...mapState('admin',['articles']),
		...mapState('auth', ['user']),
		...mapGetters('posts', ['siteTitle']),
		filterArticles () {
			return this.articles.filter(article => article.draft === this.drafts)
		},
		headTitle () {
			let type = 'Posts'
			if(this.drafts)
				type = 'Drafts'
			return `Admin View ${type} - ${this.siteTitle}`
		},
		postType () {
			return this.drafts ? 'Drafts' : 'Posts'
		},
		description () {
			return this.drafts ? 'create a draft' : 'publish a post'
		}
	},
	async mounted () {
		const options = {
			params: {
				params: {
					draft: this.drafts,
					contributorId: this.user.contributorId
				}
			}
		}
		await this.fetchArticlesApi(options)
	},
	methods: {
		...mapActions('admin',['fetchArticlesApi'])
	}
}
</script>
