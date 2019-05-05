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
// import PostPreview from '@/components/AdminView/PostPreview'
import DisplayArticles from '@/components/Layouts/DisplayArticles'
import { mapActions, mapState } from 'vuex'

export default {
	name: 'AdminView',
	components: {
		// PostPreview,
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
			'articles'
		]),
		filterArticles () {
			return this.articles.filter(article => article.draft === this.drafts)
		}
	},
	async mounted () {
		const options = {
			params: {
				params: {
					// skip: 0,
					// limit: 15
				},
				extend: false
			}
		}
		await this.getArticles(options)
	},
	methods: {
		...mapActions([
			'getArticles'
		])
	}
}

</script>

<style scoped>
</style>
