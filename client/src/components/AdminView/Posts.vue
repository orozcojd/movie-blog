<template>
  <v-container
    fluid
    grid-list-md
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        v-for="article in filterArticles"
        :key="article.id"
        md4
        xs12
      >
        <post-preview
          class="post-preview"
          :article="article"
          to="article-view" 
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import PostPreview from '@/components/AdminView/PostPreview'
import { mapActions, mapState } from 'vuex'

export default {
	name: 'AdminView',
	components: {
		PostPreview
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
	methods: {
		...mapActions([
			'getArticles'
		])
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
		/*
      get articles from store
    */
		try {
			if (!this.articles.length) {
				await this.getArticles()
			}
		} catch (e) {
			console.log(e)
		}
	}
}
</script>

<style scoped>
</style>
