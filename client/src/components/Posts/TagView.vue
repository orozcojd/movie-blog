<template>
  <v-container
    v-if="loaded"
    fluid
    grid-list-md
  >
    <v-layout
      row
      wrap
    >
      <v-flex md12>
        <h1>{{ tag }}</h1>
      </v-flex>
      <v-flex
        v-for="article in articles"
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
import PostPreview from '@/components/Posts/PostPreview'

import { mapActions, mapState } from 'vuex'

export default {
  
	name: 'TagView',
	components: {
		PostPreview
	},
	data () {
		return {
			tag: '',
			loaded: false
		}
	},
	computed: {
		...mapState([
			'articles'
		]),
	},
	async mounted() {
		let tag = this.$route.params.tagName
		this.tag = tag.split('-').join(" ")
		await this.getArticlesByTag(tag)
		this.loaded = true
	},
	methods: {
		...mapActions([
			'getArticlesByTag'
		])
	},
}
</script>

<style scoped>

</style>
