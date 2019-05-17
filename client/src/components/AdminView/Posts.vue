<template>
  <v-container
    fluid
    grid-list-md
  >
    <vue-headful
      :title="headTitle"
    />
    <display-articles 
      :articles="filterArticles"
      :admin="true"
    />
  </v-container>
</template>

<script>
import DisplayArticles from '@/components/Layouts/DisplayArticles'
import { mapActions, mapState } from 'vuex'

export default {
	name: 'AdminView',
	components: {
		DisplayArticles
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
		...mapState([
			'articles',
			'user'
		]),
		filterArticles () {
			return this.articles.filter(article => article.draft === this.drafts)
		},
		headTitle() {
			let type = 'Posts'
			if(this.drafts)
				type = 'Drafts'
			return `Admin View ${type} - Unsolicited.mp3`
		}
	},
	async mounted () {
		const options = {
			params: {
				params: {
					draft: this.drafts,
					contributorId: this.user.contributorId
				},
				extend: false,
			}
		}
		await this.getArticlesApi(options)
	},
	methods: {
		...mapActions([
			'getArticlesApi'
		])
	}
}

</script>

<style scoped>
</style>
