<template>
  <div>
    <vue-headful
      :title="headTitle"
    />
    <admin-display-articles 
      :articles="filterArticles"
      :admin="true"
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
	data () {
		return {
		}
	},
	computed: {
		...mapState('admin',['articles']),
		...mapState('auth', ['user']),
		...mapGetters('posts', ['siteTitle']),
		filterArticles () {
			return this.articles.filter(article => article.draft === this.drafts)
		},
		headTitle() {
			let type = 'Posts'
			if(this.drafts)
				type = 'Drafts'
			return `Admin View ${type} - ${this.siteTitle}`
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

<style scoped>
</style>
