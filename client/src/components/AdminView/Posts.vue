<template>
  <v-container
    fluid
    grid-list-md
  >
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
		}
	},
	async mounted () {
		console.log(this.user.contributorId)
		// skip: 0,
		// limit: 15
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
